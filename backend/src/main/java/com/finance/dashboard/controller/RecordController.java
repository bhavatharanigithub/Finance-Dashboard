package com.finance.dashboard.controller;

import com.finance.dashboard.dto.FinancialRecordRequest;
import com.finance.dashboard.dto.FinancialRecordResponse;
import com.finance.dashboard.dto.MessageResponse;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.security.UserDetailsImpl;
import com.finance.dashboard.service.FinancialRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/records")
public class RecordController {
    @Autowired
    private FinancialRecordService recordService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FinancialRecordResponse> createRecord(
            @Valid @RequestBody FinancialRecordRequest request,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        return ResponseEntity.ok(recordService.createRecord(request, userPrincipal));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    public ResponseEntity<Page<FinancialRecordResponse>> getRecords(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            Pageable pageable) {
        
        com.finance.dashboard.entity.User user = com.finance.dashboard.entity.User.builder().id(userPrincipal.getId()).build();
        return ResponseEntity.ok(recordService.getRecords(user, category, type, startDate, endDate, search, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FinancialRecordResponse> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody FinancialRecordRequest request,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        return ResponseEntity.ok(recordService.updateRecord(id, request, userPrincipal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        recordService.deleteRecord(id, userPrincipal);
        return ResponseEntity.ok(new MessageResponse("Record deleted successfully"));
    }
}
