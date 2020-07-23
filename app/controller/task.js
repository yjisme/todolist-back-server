const Controller = require("egg").Controller;

module.exports = class extends Controller {
  async today() {
    this.ctx.body = await this.service.task.getTodayTasks(
      this.ctx.params.userId
    );
  }

  async schedule() {
    this.ctx.body = await this.service.task.getFutureTasks(
      this.ctx.params.userId
    );
  }

  async pass() {
    this.ctx.body = await this.service.task.getPassTasks(
      this.ctx.params.userId
    );
  }

  async urgency() {
    this.ctx.body = await this.service.task.getUrgencyTasks(
      this.ctx.params.userId
    );
  }

  async noteBook() {
    let page = parseInt(this.ctx.query.page);
    let limit = parseInt(this.ctx.query.limit);
    if (!Number.isInteger(page)) {
      page = 1;
    }
    if (!Number.isInteger(limit)) {
      limit = 30;
    }
    this.ctx.body = await this.service.task.getNoteBook(
      this.ctx.params.userId,
      page,
      limit
    );
  }

  async categroyTasks() {
    this.ctx.body = await this.service.task.getTasks(
      this.ctx.params.userId,
      this.ctx.params.cateId
    );
  }

  async summary() {
    this.ctx.body = await this.service.task.getSummary(this.ctx.params.userId);
  }

  async addTask() {
    this.ctx.request.body.userId = +this.ctx.params.userId;
    this.ctx.body = await this.service.task.addTask(this.ctx.request.body);
  }

  async updateTask() {
    this.ctx.body = await this.service.task.updateTask(
      +this.ctx.params.userId,
      +this.ctx.params.taskId,
      this.ctx.request.body
    );
  }

  async deleteTask() {
    this.ctx.body = await this.service.task.deleteTask(
      +this.ctx.params.userId,
      +this.ctx.params.taskId
    );
  }

  async searchTask() {
    this.ctx.body = await this.service.task.searchTask(
      this.ctx.params.userId,
      this.ctx.query.key,
      this.ctx.query.page,
      this.ctx.query.limit
    );
  }
};
