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
        isActive: u.isActive,
        clientNumber1c: u.clientNumber1c,
        createdAt: u.createdAt,
      }));
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
  }