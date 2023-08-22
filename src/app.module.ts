import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { CategoryModule } from './category/category.module';
import { ResultModule } from './result/result.module';
import { ResultDetailModule } from './result-detail/result-detail.module';
import { FilesTorageModule } from './files-torage/files-torage.module';
import { SenderModule } from './sender/sender.module';

@Module({
  imports: [UserModule, PrismaModule, QuizModule, AuthModule, QuestionModule, AnswerModule, CategoryModule, ResultModule, ResultDetailModule, FilesTorageModule, SenderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
