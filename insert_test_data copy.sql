# Insert data into the tables

USE health;

INSERT INTO settings ('manager_name', 'title', 'settings_description') VALUES ('Event Manager Name','Site Name', 'This is the site description');

INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES ('gold', 'gold', 'smiths', 'gold@smiths.com', '$2b$10$56IMMFyKK7MkJZt7zG9/Ue9jdZ5KDK5L4AEMYPpiXN9aeNXIKEELq');