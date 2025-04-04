# Resource generation

```
nest g resource <resource-name>
```

# DB Setup and Handling

```
// Initial db setup
npm run orm-generate

// Regenerate (for development)
npm run orm-reg

// Apply the new schema to the database
npm run migrate
```

# Notes on Authentication

- Access token is saved in "jwt" cookie
- Currently no roles are supported
