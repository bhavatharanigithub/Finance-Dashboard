package com.finance.dashboard.controller;

import com.finance.dashboard.dto.FinancialRecordResponse;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.service.FinancialRecordService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.finance.dashboard.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/export")
public class ExportController {

    @Autowired
    private FinancialRecordService recordService;

    @GetMapping("/csv")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public void exportToCSV(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            HttpServletResponse response) throws IOException {
        
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; file=finance_records.csv");

        // Use a large page size to get all relevant records for export
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        Page<FinancialRecordResponse> recordsPage = recordService.getRecords(
                user, category, type, startDate, endDate, search, PageRequest.of(0, 10000));
        
        List<FinancialRecordResponse> records = recordsPage.getContent();

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("ID,Date,Amount,Type,Category,Currency,Payment Method,Notes\n");

        for (FinancialRecordResponse record : records) {
            csvBuilder.append(record.getId()).append(",")
                    .append(record.getDate()).append(",")
                    .append(record.getAmount()).append(",")
                    .append(record.getType()).append(",")
                    .append(escapeCsv(record.getCategory())).append(",")
                    .append(record.getCurrency()).append(",")
                    .append(escapeCsv(record.getPaymentMethod())).append(",")
                    .append(escapeCsv(record.getNotes())).append("\n");
        }

        response.getWriter().write(csvBuilder.toString());
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
