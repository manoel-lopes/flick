import { Global, Module } from '@nestjs/common'
import { RepositoriesModule } from '@/infra/persistence/repositories/repositories.module'

@Global()
@Module({
  imports: [RepositoriesModule],
  providers: [
    // Add your use cases here
  ],
  exports: [
    // Export your use cases here
  ],
})
export class UseCasesModule {}
