package com.finance.dashboard.dto;

import com.finance.dashboard.entity.Role;
import com.finance.dashboard.entity.UserStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
}
