package com.ecom.backrow.api.Controller;

import com.ecom.backrow.api.Entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping("/login")
public class LoginController {

    @RequestMapping(method = RequestMethod.POST)
    public void doLogin(@Valid User user, BindingResult result) {
        // login logic here
    }
}
