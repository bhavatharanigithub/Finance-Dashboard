package com.finance.dashboard.controller;

import com.finance.dashboard.dto.CategoryTotalDTO;
import com.finance.dashboard.dto.DashboardSummaryResponse;
import com.finance.dashboard.dto.FinancialRecordResponse;
import com.finance.dashboard.dto.MonthlyTrendDTO;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.security.UserDetailsImpl;
import com.finance.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/summary")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /** GET /summary — total income, total expense, net balance */
    @GetMapping
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        return ResponseEntity.ok(dashboardService.getSummary(user));
    }

    /**
     * GET /summary/categories?type=EXPENSE   — category-wise totals
     * Also reachable as /summary/category?type=EXPENSE for backwards compatibility.
     */
    @GetMapping({"/categories", "/category"})
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<List<CategoryTotalDTO>> getCategoryTotals(
            @RequestParam(defaultValue = "EXPENSE") TransactionType type,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        return ResponseEntity.ok(dashboardService.getCategoryTotals(user, type));
    }

    /** GET /summary/trends — monthly income vs expense */
    @GetMapping("/trends")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<List<MonthlyTrendDTO>> getMonthlyTrends(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        return ResponseEntity.ok(dashboardService.getMonthlyTrends(user));
    }

    /** GET /summary/recent — last 8 transactions */
    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<List<FinancialRecordResponse>> getRecentTransactions(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        return ResponseEntity.ok(dashboardService.getRecentTransactions(user));
    }
}
