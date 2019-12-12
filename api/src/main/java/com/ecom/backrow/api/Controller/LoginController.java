package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Entity.Customer;
import com.ecom.backrow.api.Service.ILoginService;
import com.ecom.backrow.api.Service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginController {

    private ILoginService loginService;

    @Autowired
    public LoginController(LoginService loginService ) {
        this.loginService = loginService;
    }

    @PostMapping(value = "/login")
    @ResponseBody
    public ResponseEntity<Customer> doLogin(@RequestParam(name = "username") String username, @RequestParam(name = "password") String password){
        Customer user = loginService.getUser(username,password);
        if (user == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping(value = "/register")
    @ResponseBody
    public ResponseEntity<Customer> doRegister(@RequestBody Customer user){
        user = loginService.saveUser(user);
        return ResponseEntity.ok(user);
    }
}
