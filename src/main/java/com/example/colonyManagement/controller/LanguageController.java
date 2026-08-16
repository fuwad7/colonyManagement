package com.example.colonyManagement.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/language")
public class LanguageController {

    @Autowired
    private MessageSource messageSource;

    @GetMapping("/status")
    public ResponseEntity<?> getStatusMessage() {
        String localizedMessage = messageSource.getMessage("api.success.save", null, LocaleContextHolder.getLocale());
        return ResponseEntity.ok(Map.of("message", localizedMessage));
    }

}
