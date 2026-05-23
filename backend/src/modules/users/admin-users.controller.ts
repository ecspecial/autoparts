import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    Post,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SetClientDiscountDto } from './dto/set-client-discount.dto';
import { SetUserApiKeyDto } from './dto/set-user-api-key.dto';
import { SetClientDiscountBy1cDto } from './dto/set-client-discount-by-1c.dto';
import { SetUserApiKeyBy1cDto } from './dto/set-user-api-key-by-1c.dto';
  
  @ApiTags('Администрирование пользователей')
  @Controller('admin/users')
  export class AdminUsersController {
    private readonly ADMIN_PASSWORD = process.env.CROSS_IMPORT_PASSWORD || 'change-me';
  
    constructor(private readonly usersService: UsersService) {}
  
    // Simple password check for admin endpoints
    private checkPassword(password: string) {
      if (password !== this.ADMIN_PASSWORD) {
        throw new UnauthorizedException('Неверный пароль администратора');
      }
    }
  
    @Post('pending')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Клиенты без клиентского номера 1С (ожидают активации)' })
    async getPendingUsers(@Body() body: { password: string }) {
      this.checkPassword(body.password);
      const users = await this.usersService.findPending();
      return users.map(u => ({
        id: u.id,
        phone: u.phone,
        email: u.email,
        entityType: u.entityType,
        fullName: u.fullName,
        balance: Number(u.balance),
        isActive: u.isActive,
        clientNumber1c: u.clientNumber1c,
        createdAt: u.createdAt,
      }));
    }
  
    @Post('active')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Клиенты с клиентским номером 1С (активные)' })
    async getActiveUsers(@Body() body: { password: string }) {
      this.checkPassword(body.password);
      const users = await this.usersService.findActive();
      return users.map(u => ({
        id: u.id,
        phone: u.phone,
        email: u.email,
        entityType: u.entityType,
        fullName: u.fullName,
        balance: Number(u.balance),
        discount: u.discount,
        hasApiKey: !!u.apiKey,
        isActive: u.isActive,
        clientNumber1c: u.clientNumber1c,
        createdAt: u.createdAt,
      }));
    }
  
    /** По номеру 1С (без числового id сайта в URL) — см. также POST …/by-1c/api-key */
    @Post('by-1c/discount')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Установить справочную скидку ЛК по client_number_1c',
      description:
        'Тело: password, client_number_1c, discount — для интеграций, где известен только номер клиента в 1С.',
    })
    async setClientDiscountBy1c(@Body() body: SetClientDiscountBy1cDto) {
      this.checkPassword(body.password);
      const user = await this.usersService.updateClientDiscountBy1c(
        body.client_number_1c,
        body.discount,
      );
      return {
        message: `Скидка для отображения в ЛК установлена: ${body.discount}%`,
        client_number_1c: user.clientNumber1c,
        user: {
          id: user.id,
          email: user.email,
          discount: user.discount,
        },
      };
    }

    @Post('by-1c/api-key')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Задать API-ключ клиенту по client_number_1c',
      description:
        'Тело: password, client_number_1c, apiKey — для интеграций, где известен только номер клиента в 1С.',
    })
    async setUserApiKeyBy1c(@Body() body: SetUserApiKeyBy1cDto) {
      this.checkPassword(body.password);
      const user = await this.usersService.updateUserApiKeyBy1c(
        body.client_number_1c,
        body.apiKey,
      );
      return {
        message: 'API-ключ сохранён',
        client_number_1c: user.clientNumber1c,
        user: { id: user.id, email: user.email, apiKey: user.apiKey },
      };
    }

    @Post(':id/activate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Присвоить клиентский номер 1С пользователю' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          password: { type: 'string' },
          clientNumber1c: { type: 'string', example: 'К-00001234' },
        },
        required: ['password', 'clientNumber1c'],
      },
    })
    async activateUser(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string; clientNumber1c: string },
    ) {
      this.checkPassword(body.password);
      const user = await this.usersService.activate(id, body.clientNumber1c);
      return {
        message: `Пользователь ${user.email} активирован с номером ${body.clientNumber1c}`,
        user: {
          id: user.id,
          email: user.email,
          clientNumber1c: user.clientNumber1c,
          isActive: user.isActive,
        },
      };
    }

    @Post(':id/deactivate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Снять клиентский номер 1С и деактивировать пользователя' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          password: { type: 'string' },
        },
        required: ['password'],
      },
    })
    async deactivateUser(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string },
    ) {
      this.checkPassword(body.password);
      const user = await this.usersService.deactivate(id);
      return {
        message: `Пользователь ${user.email} деактивирован, клиентский номер снят`,
        user: {
          id: user.id,
          email: user.email,
          clientNumber1c: user.clientNumber1c,
          isActive: user.isActive,
        },
      };
    }
  
    @Post(':id/balance')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Обновить баланс пользователя' })
    async updateBalance(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string; balance: number },
    ) {
      this.checkPassword(body.password);
      const user = await this.usersService.updateBalance(id, body.balance);
      return {
        message: `Баланс обновлен`,
        user: { id: user.id, email: user.email, balance: Number(user.balance) },
      };
    }

    @Post(':id/discount')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary:
        'Установить справочную скидку для личного кабинета (отображение для клиента; на расчёт цены на сайте не влияет)',
    })
    async setClientDiscount(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: SetClientDiscountDto,
    ) {
      this.checkPassword(body.password);
      const user = await this.usersService.updateClientDiscount(id, body.discount);
      return {
        message: `Скидка для отображения в ЛК установлена: ${body.discount}%`,
        user: { id: user.id, email: user.email, discount: user.discount },
      };
    }

    @Post(':id/api-key')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Задать пользователю API-ключ (значение передаётся целиком; формируется вручную)' })
    async setUserApiKey(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: SetUserApiKeyDto,
    ) {
      this.checkPassword(body.password);
      const user = await this.usersService.updateUserApiKey(id, body.apiKey);
      return {
        message: 'API-ключ сохранён',
        user: { id: user.id, email: user.email, apiKey: user.apiKey },
      };
    }
  }