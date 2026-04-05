package com.finance.dashboard.dto;

import com.finance.dashboard.entity.TransactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class FinancialRecordResponse {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private LocalDate date;
    private String currency;
    private String paymentMethod;
    private String notes;
}
