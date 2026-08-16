package com.example.colonyManagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping({ "/login", "/register", "/dashboard", "/colonies", "/buildings", "/users", "/assets", "/persons" })
    public String forwardToRoute() {
        return "forward:/index.html";
    }
}
