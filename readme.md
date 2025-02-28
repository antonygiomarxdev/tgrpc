# tygrpc 🚀

**TypeScript-first gRPC Framework**  
Automatically generate gRPC services from TypeScript classes.  
Built for efficiency, type safety, and developer happiness.

---

## Features ✨

- 🎯 **TypeScript-First**: Define services using TypeScript decorators.
- 🔄 **Auto-Generated Protos**: No need to write `.proto` files manually.
- ⚡ **gRPC Efficiency**: HTTP/2, binary serialization, and streaming support.
- 🔒 **End-to-End Type Safety**: Type-safe RPCs from server to client.
- 🧩 **Zero Boilerplate**: Focus on business logic, not setup.

---

## Installation 📦

```bash
npm install tygrpc @grpc/grpc-js reflect-metadata
```

---

## Quick Start 🚀

### 1. Define a Service
```typescript
// user.service.ts
import { tygrpc } from 'tygrpc';

@tygrpc.Service({ name: 'UserService' })
export class UserService {
  @tygrpc.Method()
  async getUser(req: { id: string }) {
    return { id: req.id, name: 'Alice' };
  }
}
```

### 2. Start the Server
```typescript
// server.ts
import { createTygrpcServer } from 'tgrpc';
import { UserService } from './user.service';

const server = createTygrpcServer();
server.addService(UserService);
server.start(50051);
```

### 3. Call from Client
```typescript
// client.ts
import { UserServiceClient } from './generated/user'; // Auto-generated
import { credentials } from '@grpc/grpc-js';

const client = new UserServiceClient(
  'localhost:50051',
  credentials.createInsecure()
);

client.getUser({ id: '123' }, (err, response) => {
  console.log(response); // { id: '123', name: 'Alice' }
});
```

---

## Why tygrpc? 🤔

| Feature               | tygrpc         | gRPC                 | tRPC                |
|-----------------------|----------------|----------------------|---------------------|
| TypeScript Native     | ✅              | ❌                   | ✅                  |
| .proto Files          | Auto-generated | Manual               | Not used           |
| Transport             | HTTP/2 (gRPC)  | HTTP/2 (gRPC)        | HTTP/1.1           |
| Type Safety           | End-to-End     | Partial              | Full                |

---

## Advanced Usage 🔧

### Custom Method Names
```typescript
@tygrpc.Service({ name: 'Calculator' })
class CalculatorService {
  @tygrpc.Method({ name: 'AddNumbers' })
  add(a: number, b: number) {
    return a + b;
  }
}
```

### Error Handling
```typescript
@tygrpc.Method()
async deleteUser(req: { id: string }) {
  if (!req.id) throw new Error('ID is required');
  // ...
}
```

---

## Project Structure 🗂️

```
tygrpc/
├── src/
│   ├── core/            # Domain logic
│   ├── infrastructure/  # gRPC/proto implementations
│   └── features/        # Vertical slices (decorators, server...)
└── tests/               # Jest tests
```

---

## Contributing 🤝

1. Fork the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Submit a PR!

---

## License 📄

MIT License. See [LICENSE](LICENSE) for details.
```