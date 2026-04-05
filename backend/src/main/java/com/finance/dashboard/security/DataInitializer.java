package com.finance.dashboard.security;

import com.finance.dashboard.entity.Role;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.repository.FinancialRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinancialRecordRepository recordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking for seed data...");

        // Seed admin user
        User admin;
        if (!userRepository.existsByEmail("admin@example.com")) {
            admin = User.builder()
                    .name("Admin User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user seeded: admin@example.com / admin123");
        } else {
            admin = userRepository.findByEmail("admin@example.com").get();
        }

        // Seed analyst user
        if (!userRepository.existsByEmail("analyst@example.com")) {
            User analyst = User.builder()
                    .name("Alice Analyst")
                    .email("analyst@example.com")
                    .password(passwordEncoder.encode("analyst123"))
                    .role(Role.ROLE_ANALYST)
                    .build();
            userRepository.save(analyst);
            System.out.println("Demo analyst seeded: analyst@example.com / analyst123");
        }

        // Seed viewer user
        if (!userRepository.existsByEmail("viewer@example.com")) {
            User viewer = User.builder()
                    .name("Bob Viewer")
                    .email("viewer@example.com")
                    .password(passwordEncoder.encode("viewer123"))
                    .role(Role.ROLE_VIEWER)
                    .build();
            userRepository.save(viewer);
            System.out.println("Demo viewer seeded: viewer@example.com / viewer123");
        }

        // Seed financial records for admin if none exist
        List<User> allUsers = userRepository.findAll();
        for (User u : allUsers) {
            if (recordRepository.countByUser(u) == 0) {
                System.out.println("Seeding financial records for user: " + u.getEmail());
                seedRecordsForUser(u);
            }
        }
        System.out.println("Seeding complete.");
    }

    private void seedRecordsForUser(User user) {
        LocalDate today = LocalDate.now();

        // --- MONTH 0 (current month) ---
        save(user, "4800.00", TransactionType.INCOME, "Salary", today.withDayOfMonth(1), "Monthly salary - April", "Bank Transfer");
        save(user, "1200.00", TransactionType.INCOME, "Freelance", today.withDayOfMonth(5), "React dashboard project", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", today.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "320.50", TransactionType.EXPENSE, "Groceries", today.withDayOfMonth(4), "Weekly grocery shopping", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", today.withDayOfMonth(3), "Netflix, Spotify bundles", "Credit Card");
        save(user, "215.00", TransactionType.EXPENSE, "Utilities", today.withDayOfMonth(6), "Electricity and internet bills", "Bank Transfer");
        save(user, "145.00", TransactionType.EXPENSE, "Dining Out", today.withDayOfMonth(8), "Restaurants and cafes", "Credit Card");
        save(user, "78.00", TransactionType.EXPENSE, "Transport", today.withDayOfMonth(10), "Monthly bus pass + Uber", "Credit Card");
        save(user, "500.00", TransactionType.INCOME, "Dividends", today.withDayOfMonth(7), "Q1 stock dividends payout", "Bank Transfer");
        save(user, "250.00", TransactionType.EXPENSE, "Shopping", today.withDayOfMonth(9), "Clothing and accessories", "Credit Card");

        // --- MONTH 1 (last month) ---
        LocalDate m1 = today.minusMonths(1);
        save(user, "4800.00", TransactionType.INCOME, "Salary", m1.withDayOfMonth(1), "Monthly salary", "Bank Transfer");
        save(user, "800.00", TransactionType.INCOME, "Freelance", m1.withDayOfMonth(12), "API integration work", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", m1.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "298.75", TransactionType.EXPENSE, "Groceries", m1.withDayOfMonth(5), "Supermarket and fresh produce", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", m1.withDayOfMonth(3), "Streaming services", "Credit Card");
        save(user, "198.00", TransactionType.EXPENSE, "Utilities", m1.withDayOfMonth(7), "Gas and electricity", "Bank Transfer");
        save(user, "340.00", TransactionType.EXPENSE, "Health", m1.withDayOfMonth(14), "Doctor visit and medicine", "Credit Card");
        save(user, "175.00", TransactionType.EXPENSE, "Transport", m1.withDayOfMonth(10), "Fuel and parking", "Debit Card");
        save(user, "420.00", TransactionType.EXPENSE, "Travel", m1.withDayOfMonth(20), "Weekend trip expenses", "Credit Card");
        save(user, "95.00", TransactionType.EXPENSE, "Entertainment", m1.withDayOfMonth(22), "Movies and events", "Credit Card");
        save(user, "350.00", TransactionType.INCOME, "Investment Gain", m1.withDayOfMonth(18), "ETF portfolio gains", "Bank Transfer");

        // --- MONTH 2 ---
        LocalDate m2 = today.minusMonths(2);
        save(user, "4800.00", TransactionType.INCOME, "Salary", m2.withDayOfMonth(1), "Monthly salary", "Bank Transfer");
        save(user, "1500.00", TransactionType.INCOME, "Freelance", m2.withDayOfMonth(8), "Mobile app UI contract", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", m2.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "412.00", TransactionType.EXPENSE, "Groceries", m2.withDayOfMonth(6), "Monthly grocery stock-up", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", m2.withDayOfMonth(3), "Streaming and tools", "Credit Card");
        save(user, "210.00", TransactionType.EXPENSE, "Utilities", m2.withDayOfMonth(8), "Utilities bill", "Bank Transfer");
        save(user, "600.00", TransactionType.EXPENSE, "Education", m2.withDayOfMonth(11), "Online courses - Udemy, Coursera", "Credit Card");
        save(user, "88.00", TransactionType.EXPENSE, "Gym", m2.withDayOfMonth(5), "Gym membership monthly", "Debit Card");
        save(user, "190.00", TransactionType.EXPENSE, "Dining Out", m2.withDayOfMonth(15), "Team lunches and dinners", "Credit Card");
        save(user, "200.00", TransactionType.INCOME, "Dividends", m2.withDayOfMonth(20), "Bond interest payment", "Bank Transfer");

        // --- MONTH 3 ---
        LocalDate m3 = today.minusMonths(3);
        save(user, "4800.00", TransactionType.INCOME, "Salary", m3.withDayOfMonth(1), "Monthly salary", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", m3.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "280.00", TransactionType.EXPENSE, "Groceries", m3.withDayOfMonth(4), "Groceries and household", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", m3.withDayOfMonth(3), "Monthly subscriptions", "Credit Card");
        save(user, "750.00", TransactionType.EXPENSE, "Insurance", m3.withDayOfMonth(10), "Annual car insurance installment", "Bank Transfer");
        save(user, "165.00", TransactionType.EXPENSE, "Transport", m3.withDayOfMonth(12), "Transport and travel", "Debit Card");
        save(user, "1200.00", TransactionType.INCOME, "Freelance", m3.withDayOfMonth(15), "Data pipeline consulting", "Bank Transfer");
        save(user, "95.00", TransactionType.EXPENSE, "Entertainment", m3.withDayOfMonth(18), "Events and recreation", "Credit Card");
        save(user, "50.00", TransactionType.EXPENSE, "Gifts", m3.withDayOfMonth(22), "Birthday gift purchase", "Credit Card");

        // --- MONTH 4 ---
        LocalDate m4 = today.minusMonths(4);
        save(user, "4800.00", TransactionType.INCOME, "Salary", m4.withDayOfMonth(1), "Monthly salary", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", m4.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "310.25", TransactionType.EXPENSE, "Groceries", m4.withDayOfMonth(5), "Weekly groceries", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", m4.withDayOfMonth(3), "Streaming services", "Credit Card");
        save(user, "520.00", TransactionType.EXPENSE, "Shopping", m4.withDayOfMonth(9), "Seasonal wardrobe update", "Credit Card");
        save(user, "88.00", TransactionType.EXPENSE, "Gym", m4.withDayOfMonth(5), "Gym membership", "Debit Card");
        save(user, "450.00", TransactionType.INCOME, "Investment Gain", m4.withDayOfMonth(16), "Crypto partial exit", "Bank Transfer");
        save(user, "175.00", TransactionType.EXPENSE, "Health", m4.withDayOfMonth(20), "Annual health checkup", "Credit Card");
        save(user, "1000.00", TransactionType.INCOME, "Freelance", m4.withDayOfMonth(25), "Logo and brand design work", "Bank Transfer");

        // --- MONTH 5 ---
        LocalDate m5 = today.minusMonths(5);
        save(user, "4800.00", TransactionType.INCOME, "Salary", m5.withDayOfMonth(1), "Monthly salary", "Bank Transfer");
        save(user, "1450.00", TransactionType.EXPENSE, "Rent", m5.withDayOfMonth(2), "Apartment monthly rent", "Bank Transfer");
        save(user, "275.00", TransactionType.EXPENSE, "Groceries", m5.withDayOfMonth(6), "Groceries and cooking supplies", "Debit Card");
        save(user, "89.99", TransactionType.EXPENSE, "Subscription", m5.withDayOfMonth(3), "Streaming and cloud services", "Credit Card");
        save(user, "900.00", TransactionType.EXPENSE, "Travel", m5.withDayOfMonth(12), "Flights and hotel for vacation", "Credit Card");
        save(user, "220.00", TransactionType.EXPENSE, "Dining Out", m5.withDayOfMonth(15), "Vacation dining", "Credit Card");
        save(user, "300.00", TransactionType.INCOME, "Dividends", m5.withDayOfMonth(18), "Quarterly dividend payout", "Bank Transfer");
        save(user, "125.00", TransactionType.EXPENSE, "Transport", m5.withDayOfMonth(20), "Airport transfers and taxi", "Debit Card");
    }

    private void save(User user, String amount, TransactionType type, String category, LocalDate date, String notes, String paymentMethod) {
        recordRepository.save(FinancialRecord.builder()
                .amount(new BigDecimal(amount))
                .type(type)
                .category(category)
                .date(date)
                .notes(notes)
                .user(user)
                .currency("USD")
                .paymentMethod(paymentMethod)
                .isDeleted(false)
                .build());
    }
}
