package com.finance.dashboard.dto;

import com.finance.dashboard.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendDTO {
    private LocalDateTime month;
    private BigDecimal total;
    private TransactionType type;
}
