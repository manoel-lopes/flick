import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { CacheModule } from '@/infra/cache/cache.module'
import { EnvService } from '@/infra/env/env.service'

function extractSchemaFromUrl (databaseUrl: string): string {
  const url = new URL(databaseUrl)
  return url.searchParams.get('schema') || ''
}

const entities: EntityClassOrSchema[] = []
@Global()
@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        const databaseUrl = envService.getDatabaseUrl()
        const schema = extractSchemaFromUrl(databaseUrl)
        return {
          type: 'postgres',
          url: databaseUrl,
          schema,
          entities,
          synchronize: false,
          logging: envService.get('NODE_ENV') === 'development',
        }
      },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [],
  exports: [],
})
export class RepositoriesModule {}
