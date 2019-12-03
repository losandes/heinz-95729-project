package com.ecom.backrow.api.Entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="User")
public class User implements Serializable {

    private static Long UserId;
    private static  String password;
    private static  String username;
    private static  String name;

    @Id
    @Column(name="User_Id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    public static Long getUserId() {
        return UserId;
    }

    public static void setUserId(Long userId) {
        UserId = userId;
    }

    @Column(name="Password")
    public static String getPassword() {
        return password;
    }

    public static void setPassword(String password) {
        User.password = password;
    }

    @Column(name="Username")
    public static String getUsername() {
        return username;
    }

    public static void setUsername(String username) {
        User.username = username;
    }

    @Column(name="Name")
    public static String getName() {
        return name;
    }

    public static void setName(String name) {
        User.name = name;
    }
}
