const Service = require("egg").Service;

const defaultSetting = {
  maxCategoryNumber: 10, // 最大允许用户创建多少个分类
  siteName: "渡一云规划", // 网站的名称
  siteLogo: "", // 网站的Logo访问地址
  siteDescription: "", // 网站的描述
  siteKeywords: "", // 网站关键字，逗号分隔
};

module.exports = class extends Service {
  async getSetting() {
    let setting = await this.app.model.Setting.findAll();
    const entries = setting.map((s) => [s.key, s.value]);
    setting = Object.fromEntries(entries);
    setting = this.ctx.helper.pick(setting, Object.keys(defaultSetting));
    return {
      ...defaultSetting,
      ...setting,
    };
  }

  async setSetting(setting) {
    setting = this.ctx.helper.pick(setting, Object.keys(defaultSetting));
    const entries = Object.entries(setting);
    for (const [k, v] of entries) {
      const curSetting = await this.app.model.Setting.findOne({
        where: {
          key: k,
        },
      });
      if (curSetting) {
        if (curSetting.value !== v) {
          curSetting.value = v;
          await curSetting.save();
        }
      } else {
        await this.app.model.Setting.create({
          key: k,
          value: v,
        });
      }
    }
    return await this.getSetting();
  }
};
