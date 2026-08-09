package com.example.colonyManagement.config;

import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.repository.AssetRepository;
import com.example.colonyManagement.repository.UserRepository;
import com.example.colonyManagement.repository.PersonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final PersonRepository personRepository;

    public DataInitializer(UserRepository userRepository, AssetRepository assetRepository, PersonRepository personRepository) {
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.personRepository = personRepository;
    }

    @Override
    public void run(String... args) {
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        User admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
            admin.setRole("ADMIN");
            admin.setPassword("admin123");
            admin.setEnabled(true);
            admin = userRepository.save(admin);
        } else {
            admin = User.builder()
                    .username("admin")
                    .email("admin@colony.local")
                    .password("admin123")
                    .role("ADMIN")
                    .enabled(true)
                    .build();
            admin = userRepository.save(admin);
        }

        if (!personRepository.existsByUser(admin)) {
            Person adminPerson = Person.builder()
                    .fullName(admin.getUsername())
                    .personId(admin.getUsername())
                    .phone("123-456-7890")
                    .user(admin)
                    .build();
            personRepository.save(adminPerson);
        }

        if (assetRepository.count() == 0) {
            createAssetIfNotExist("Central Sports Field", Asset.AssetType.FIELD);
            createAssetIfNotExist("Colony High School", Asset.AssetType.SCHOOL);
            createAssetIfNotExist("Colony Science College", Asset.AssetType.COLLEGE);
            createAssetIfNotExist("Community Hall & Event Center", Asset.AssetType.COMMUNITY_BUILDING);
        }
    }

    private void createAssetIfNotExist(String name, Asset.AssetType type) {
        Asset asset = new Asset();
        asset.setName(name);
        asset.setType(type);
        assetRepository.save(asset);
    }
}

