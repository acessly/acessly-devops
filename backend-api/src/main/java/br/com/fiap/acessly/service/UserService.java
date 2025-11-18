package br.com.fiap.acessly.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.fiap.acessly.model.User;
import br.com.fiap.acessly.repository.UserRepository;
import lombok.NonNull;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getUsersWithFilter(String name, String email, Pageable pageable) {
        return userRepository.findByNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
            name != null ? name : "",
            email != null ? email : "",
            pageable);
    }

    public Optional<User> getUserById(@NonNull Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> updateUser(@NonNull Long id, User userDetails) {
        return userRepository.findById(id)
            .map(user -> {
                user.setName(userDetails.getName());

                if (!user.getEmail().equals(userDetails.getEmail()) &&
                    userRepository.existsByEmail(userDetails.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                user.setEmail(userDetails.getEmail());

                if (userDetails.getPassword() != null &&
                    !userDetails.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                }

                user.setUserRole(userDetails.getUserRole());
                user.setCity(userDetails.getCity());
                user.setState(userDetails.getState());
                user.setPhone(userDetails.getPhone());

                return userRepository.save(user);
            });
    }

    public boolean deleteUser(@NonNull Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        
        return false;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
