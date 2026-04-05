package com.finance.dashboard.service;

import com.finance.dashboard.dto.FinancialRecordRequest;
import com.finance.dashboard.dto.FinancialRecordResponse;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.FinancialRecordRepository;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class FinancialRecordService {
    @Autowired
    private FinancialRecordRepository recordRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public FinancialRecordResponse createRecord(FinancialRecordRequest request, UserDetailsImpl userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinancialRecord record = FinancialRecord.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .currency(request.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .user(user)
                .isDeleted(false)
                .build();

        record = recordRepository.save(record);
        return convertToResponse(record);
    }

    public Page<FinancialRecordResponse> getRecords(User user, String category, TransactionType type, LocalDate startDate,
                                                  LocalDate endDate, String search, Pageable pageable) {
        return recordRepository.findAllFiltered(user, category, type, startDate, endDate, search, pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request, UserDetailsImpl userPrincipal) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!record.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized to update this record");
        }

        if (record.isDeleted()) {
            throw new RuntimeException("Cannot update deleted record");
        }

        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setCurrency(request.getCurrency());
        record.setPaymentMethod(request.getPaymentMethod());
        record.setNotes(request.getNotes());

        record = recordRepository.save(record);
        return convertToResponse(record);
    }

    @Transactional
    public void deleteRecord(Long id, UserDetailsImpl userPrincipal) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        
        if (!record.getUser().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Unauthorized to delete this record");
        }
        
        record.setDeleted(true);
        recordRepository.save(record);
    }

    private FinancialRecordResponse convertToResponse(FinancialRecord record) {
        return FinancialRecordResponse.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .type(record.getType())
                .category(record.getCategory())
                .date(record.getDate())
                .currency(record.getCurrency())
                .paymentMethod(record.getPaymentMethod())
                .notes(record.getNotes())
                .build();
    }
}
