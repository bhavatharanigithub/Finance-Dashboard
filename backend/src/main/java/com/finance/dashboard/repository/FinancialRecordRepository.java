package com.finance.dashboard.repository;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    @Query("SELECT r FROM FinancialRecord r WHERE r.isDeleted = false AND r.user = :user " +
           "AND (:category IS NULL OR LOWER(r.category) LIKE LOWER(CONCAT('%', :category, '%'))) " +
           "AND (:type IS NULL OR r.type = :type) " +
           "AND (:startDate IS NULL OR r.date >= :startDate) " +
           "AND (:endDate IS NULL OR r.date <= :endDate) " +
           "AND (:search IS NULL OR LOWER(r.notes) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(r.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY r.date DESC, r.id DESC")
    Page<FinancialRecord> findAllFiltered(
            @Param("user") com.finance.dashboard.entity.User user,
            @Param("category") String category,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT SUM(r.amount) FROM FinancialRecord r WHERE r.isDeleted = false AND r.user = :user AND r.type = :type")
    BigDecimal sumAmountByType(@Param("user") com.finance.dashboard.entity.User user,
                               @Param("type") TransactionType type);

    @Query("SELECT r.category as category, SUM(r.amount) as total FROM FinancialRecord r " +
           "WHERE r.isDeleted = false AND r.user = :user AND r.type = :type GROUP BY r.category ORDER BY SUM(r.amount) DESC")
    List<Map<String, Object>> sumByCategory(@Param("user") com.finance.dashboard.entity.User user,
                                             @Param("type") TransactionType type);

    @Query("SELECT YEAR(r.date) as year, MONTH(r.date) as month, r.type as type, SUM(r.amount) as total " +
           "FROM FinancialRecord r WHERE r.isDeleted = false AND r.user = :user " +
           "GROUP BY YEAR(r.date), MONTH(r.date), r.type " +
           "ORDER BY YEAR(r.date) DESC, MONTH(r.date) DESC")
    List<Map<String, Object>> getMonthlyTrends(@Param("user") com.finance.dashboard.entity.User user);

    @Query("SELECT r FROM FinancialRecord r WHERE r.isDeleted = false AND r.user = :user ORDER BY r.date DESC, r.id DESC")
    List<FinancialRecord> findRecentTransactions(@Param("user") com.finance.dashboard.entity.User user, Pageable pageable);

    long countByUser(com.finance.dashboard.entity.User user);
}
