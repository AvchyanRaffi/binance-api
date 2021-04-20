import { Global, HttpModule, Module } from "@nestjs/common";
import { ConfigService } from "./services/config.service";
import { JwtModule } from '@nestjs/jwt';

const providers = [
    ConfigService,
];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                privateKey: configService.get('JWT_SECRET_KEY'),
                publicKey: configService.get('JWT_PUBLIC_KEY')
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
