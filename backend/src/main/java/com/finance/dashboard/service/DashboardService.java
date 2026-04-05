package com.finance.dashboard.service;

import com.finance.dashboard.dto.CategoryTotalDTO;
import com.finance.dashboard.dto.DashboardSummaryResponse;
import com.finance.dashboard.dto.FinancialRecordResponse;
import com.finance.dashboard.dto.MonthlyTrendDTO;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.repository.FinancialRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private FinancialRecordRepository recordRepository;

    public DashboardSummaryResponse getSummary(com.finance.dashboard.entity.User user) {
        BigDecimal totalIncome = recordRepository.sumAmountByType(user, TransactionType.INCOME);
        BigDecimal totalExpense = recordRepository.sumAmountByType(user, TransactionType.EXPENSE);

        totalIncome  = (totalIncome  != null) ? totalIncome  : BigDecimal.ZERO;
        totalExpense = (totalExpense != null) ? totalExpense : BigDecimal.ZERO;

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(totalIncome.subtract(totalExpense))
                .build();
    }

    public List<CategoryTotalDTO> getCategoryTotals(com.finance.dashboard.entity.User user, TransactionType type) {
        return recordRepository.sumByCategory(user, type).stream()
                .map(m -> new CategoryTotalDTO(
                        (String) m.get("category"),
                        (BigDecimal) m.get("total")))
                .collect(Collectors.toList());
    }

    /**
     * Returns monthly trends.  The query returns rows with keys:
     *   year  (Integer), month (Integer), type (TransactionType), total (BigDecimal)
     * We synthesise a stable LocalDateTime (1st of the month) for the DTO.
     */
    public List<MonthlyTrendDTO> getMonthlyTrends(com.finance.dashboard.entity.User user) {
        List<Map<String, Object>> result = recordRepository.getMonthlyTrends(user);
        return result.stream()
                .map(m -> {
                    Number year  = (Number) m.get("year");
                    Number month = (Number) m.get("month");
                    BigDecimal total = (BigDecimal) m.get("total");
                    TransactionType type = (TransactionType) m.get("type");

                    LocalDateTime date = LocalDate.of(
                            year  != null ? year.intValue()  : 2024,
                            month != null ? month.intValue() : 1,
                            1
                    ).atStartOfDay();

                    return new MonthlyTrendDTO(date, total, type);
                })
                .collect(Collectors.toList());
    }

    public List<FinancialRecordResponse> getRecentTransactions(com.finance.dashboard.entity.User user) {
        List<FinancialRecord> records = recordRepository.findRecentTransactions(user, PageRequest.of(0, 8));
        return records.stream()
                .map(r -> FinancialRecordResponse.builder()
                        .id(r.getId())
                        .amount(r.getAmount())
                        .type(r.getType())
                        .category(r.getCategory())
                        .date(r.getDate())
                        .notes(r.getNotes())
                        .currency(r.getCurrency())
                        .paymentMethod(r.getPaymentMethod())
                        .build())
                .collect(Collectors.toList());
    }
}
