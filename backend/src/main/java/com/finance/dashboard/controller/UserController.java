package com.finance.dashboard.controller;

import com.finance.dashboard.dto.UserDTO;
import com.finance.dashboard.entity.Role;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.entity.UserStatus;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /** GET /users/me — any authenticated user can fetch their own profile */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(convertToDTO(user));
    }

    /** GET /users — admin only: list all users */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /** PUT /users/{id}/role — admin only: change a user's role */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleRequest roleRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            user.setRole(Role.valueOf(roleRequest.getRole()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleRequest.getRole());
        }
        userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(user));
    }

    /** PUT /users/{id}/status — admin only: activate or deactivate a user */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest statusRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            user.setStatus(UserStatus.valueOf(statusRequest.getStatus()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusRequest.getStatus());
        }
        userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(user));
    }

    /** DELETE /users/{id} — admin only: remove a user */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        if (id.equals(currentUser.getId())) {
            throw new RuntimeException("You cannot delete your own account.");
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---- inner request body helpers ----

    public static class RoleRequest {
        private String role;
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class StatusRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // ---- conversion helper ----

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
