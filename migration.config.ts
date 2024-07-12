import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigurationEnum } from './src/common/configuration/configuration.enum';
ConfigModule.forRoot({ envFilePath: '.env.dev' });
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  host: configService.get(ConfigurationEnum.DB_HOST),
  port: configService.get(ConfigurationEnum.DB_PORT),
  username: configService.get(ConfigurationEnum.DB_USERNAME),
  password: configService.get(ConfigurationEnum.DB_PASSWORD),
  database: configService.get(ConfigurationEnum.DB_DATABASE),
  migrations: [__dirname + '/src/migrations/*.{ts,js}'],
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  namingStrategy: new SnakeNamingStrategy(),
};
const datasource = new DataSource(dataSourceOptions);
datasource.initialize();

export default datasource;
