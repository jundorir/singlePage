import experienceBookPrimary from "@assets/images/material/experience_book_primary.png";
import experienceBookIntermediate from "@assets/images/material/experience_book_intermediate.png";
import experienceBookSenior from "@assets/images/material/experience_book_senior.png";
import EmpireHoe from "@assets/images/material/empire_hoe.png";
import guildToken from "@assets/images/material/guild_token.png";
import spiritDrug from "@assets/images/material/spirit_drug.png";
import treasureBox from "@assets/images/material/treasure_box.png";
import gold from "@assets/images/material/gold.png";
import monthCard from "@assets/images/material/month_card.png";
//TODO:增加月卡图标
const Material = {
  ExperienceBookPrimary: {
    images: experienceBookPrimary,
    title: "初级经验书",
    exp: 100,
  },
  ExperienceBookIntermediate: {
    images: experienceBookIntermediate,
    title: "中级经验书",
    exp: 1000,
  },
  ExperienceBookSenior: {
    images: experienceBookSenior,
    title: "高级经验书",
    exp: 10000,
  },
  EmpireHoeToken: {
    images: EmpireHoe,
    title: "锄头",
  },
  GuildToken: {
    images: guildToken,
    title: "公会令牌",
  },
  SpiritDrug: {
    images: spiritDrug,
    title: "体力药水",
    spirit: 10,
  },
  TreasureBox: {
    images: treasureBox,
    title: "宝箱",
  },
  Gold: {
    images: gold,
    title: "金币",
  },
  MonthCard: {
    images: monthCard,
    title: "月卡",
  },
};

export default Material;
