package com.example.colonyManagement.config;

import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.repository.AssetRepository;
import com.example.colonyManagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    public DataInitializer(UserRepository userRepository, AssetRepository assetRepository) {
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
    }

    @Override
    public void run(String... args) {
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setRole("ADMIN");
            admin.setPassword("admin123");
            admin.setEnabled(true);
            userRepository.save(admin);
        } else {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@colony.local")
                    .password("admin123")
                    .role("ADMIN")
                    .enabled(true)
                    .build();
            userRepository.save(admin);
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

