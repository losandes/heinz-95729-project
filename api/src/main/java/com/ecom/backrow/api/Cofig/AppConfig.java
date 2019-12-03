package com.ecom.backrow.api.Cofig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class AppConfig
{
    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setUsername(env.getProperty("spring.datasource.username"));
        driverManagerDataSource.setUrl(env.getProperty("spring.datasource.url"));
        driverManagerDataSource.setDriverClassName(env.getProperty("spring.datasource.driver-class-name"));
        driverManagerDataSource.setPassword(env.getProperty("spring.datasource.password"));
        return driverManagerDataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean localContainerEntityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
        localContainerEntityManagerFactoryBean.setDataSource(dataSource());
        localContainerEntityManagerFactoryBean.setJpaVendorAdapter(getHibernateJpaVendorAdapter());
        localContainerEntityManagerFactoryBean.setJpaProperties(additionalProperties());
        localContainerEntityManagerFactoryBean.setPackagesToScan("com.ecom.backrow.api.Entity");
        return localContainerEntityManagerFactoryBean;
    }

    @Bean
    public JpaVendorAdapter getHibernateJpaVendorAdapter() {
        HibernateJpaVendorAdapter hibernateJpaVendorAdapter = new HibernateJpaVendorAdapter();
        hibernateJpaVendorAdapter.setShowSql(true);
        hibernateJpaVendorAdapter.setGenerateDdl(true);
        return hibernateJpaVendorAdapter;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(entityManagerFactory().getObject());
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    Properties additionalProperties() {
        Properties properties = new Properties();
        properties.put("hibernate.dialect", env.getProperty("spring.jpa.database-platform"));
        properties.put("hibernate.hbm2ddl.auto", env.getProperty("spring.jpa.hibernate.ddl-auto"));
        properties.put("hibernate_show_sql", env.getProperty("spring.jpa.generate-ddl"));
        return properties;
    }
}
