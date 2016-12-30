/*
Navicat MySQL Data Transfer

Source Server         : 大屏可视化平台
Source Server Version : 50611
Source Host           : localhost:3306
Source Database       : bd_tianmu_visual_platform
/Applications/XAMPP/xamppfiles/htdocs/kent/project/tianmu/tmuserv/document
CREATE DATABASE `bd_tianmu_visual_platform` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

Target Server Type    : MYSQL
Target Server Version : 50611
File Encoding         : 65001

Date: 2016-12-21 02:43:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `tmu_echarts`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_echarts`;
CREATE TABLE `tmu_echarts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'echarts图表名称',
  `echartsName` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'echarts key(跟echarts官网保持一致)',
  `option` longtext CHARACTER SET utf8 NOT NULL COMMENT 'echarts图表默认option (JSON)',
  `config` text CHARACTER SET utf8 COMMENT 'echarts图表默认配置(JSON)',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tmu_echarts
-- ----------------------------

-- ----------------------------
-- Table structure for `tmu_props`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_props`;
CREATE TABLE `tmu_props` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自动递增id',
  `key` varchar(32) DEFAULT NULL COMMENT '模块唯一ID',
  `icons` varchar(30) DEFAULT NULL COMMENT '图标classname',
  `name` varchar(20) DEFAULT NULL COMMENT '模块名称',
  `category` varchar(50) DEFAULT NULL COMMENT '模块分类',
  `crumb` varchar(100) DEFAULT NULL COMMENT '缩略图url',
  `option` longtext COMMENT '配置项',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tmu_props
-- ----------------------------

-- ----------------------------
-- Table structure for `tmu_scene`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_scene`;
CREATE TABLE `tmu_scene` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `themeId` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '所属主题ID',
  `sceneId` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '场景ID',
  `echartsTheme` longtext CHARACTER SET utf8 COMMENT 'echarts主题配置(json)',
  `ratio` varchar(20) CHARACTER SET utf8 DEFAULT '' COMMENT '场景宽高比例(4:3/16:9/16:10/自定义:输入宽度高度自动计算得到比例)',
  `background` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '背景图片(本地图片, 上传到服务器)',
  `backgroundColor` varchar(13) DEFAULT NULL COMMENT '背景颜色  255, 255, 255',
  `alpha` int(1) DEFAULT '1' COMMENT '透明度(0 - 1)',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(20) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`sceneId`,`themeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tmu_scene
-- ----------------------------

-- ----------------------------
-- Table structure for `tmu_scene_modules`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_scene_modules`;
CREATE TABLE `tmu_scene_modules` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` char(20) CHARACTER SET utf8 NOT NULL COMMENT '用户ID',
  `themeId` varchar(32) NOT NULL,
  `sceneId` varchar(32) NOT NULL COMMENT '场景ID',
  `elementId` varchar(32) NOT NULL COMMENT '组件ID',
  `elementType` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '组件类型(echart, node, link)',
  `echartId` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `echartType` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT 'echart图表类型, 只有elementType为echart时有效',
  `x` float(20,0) DEFAULT NULL COMMENT 'x坐标',
  `y` float(20,0) DEFAULT NULL,
  `width` int(10) DEFAULT NULL COMMENT '组件宽度',
  `height` int(10) DEFAULT NULL COMMENT '组件高度',
  `config` longtext CHARACTER SET utf8 COMMENT '组件配置',
  `option` longtext CHARACTER SET utf8 COMMENT 'echart组件选项',
  `images` text CHARACTER SET utf8 COMMENT '图表对象|图片url',
  `looper` tinyint(1) DEFAULT '0' COMMENT '是否开启实时监控',
  `api` longtext CHARACTER SET utf8 COMMENT '组件开启实时监控所用的api',
  `text` text CHARACTER SET utf8 COMMENT '组件上展现的文字(非echart组件)',
  `textPosition` text CHARACTER SET utf8 COMMENT '组件上文字的位置',
  `larm` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '告警文字',
  `level` int(10) DEFAULT '1' COMMENT '组件层级',
  `nodeAId` int(50) DEFAULT NULL COMMENT '连线link A节点ID',
  `nodeBId` int(50) DEFAULT NULL COMMENT '连线link B节点ID',
  `fontColor` varchar(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '连线线条颜色',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(200) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`themeId`,`elementId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tmu_scene_modules
-- ----------------------------

-- ----------------------------
-- Table structure for `tmu_sys_menus`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_sys_menus`;
CREATE TABLE `tmu_sys_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自动递增',
  `pid` int(11) NOT NULL COMMENT '父ID',
  `name` varchar(20) NOT NULL COMMENT '菜单名称',
  `type` varchar(20) NOT NULL COMMENT '菜单类型',
  `url` varchar(100) DEFAULT NULL COMMENT '菜单链接',
  `icons` varchar(50) DEFAULT NULL COMMENT '菜单图标名称',
  `permission` tinyint(4) NOT NULL DEFAULT '0' COMMENT '菜单权限',
  `editable` int(11) DEFAULT NULL COMMENT '菜单属性(1: 系统菜单, 2: 私有菜单)',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(50) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tmu_sys_menus
-- ----------------------------
INSERT INTO `tmu_sys_menus` VALUES ('1', '0', '配置管理', 'nav-group', '', '', '1', '2', '2016-12-19 03:22:22', null);
INSERT INTO `tmu_sys_menus` VALUES ('2', '0', '数据监控', 'nav-group', '', '', '1', '2', '2016-12-19 03:22:29', null);
INSERT INTO `tmu_sys_menus` VALUES ('3', '0', '平台管理', 'nav-group', '', '', '1', '1', '2016-12-19 00:32:23', null);
INSERT INTO `tmu_sys_menus` VALUES ('4', '3', '组件管理', 'has-sub', '', 'icon-cogs', '1', null, '2016-12-19 14:35:46', null);
INSERT INTO `tmu_sys_menus` VALUES ('5', '4', '查询组件', 'last-sub', '#/manager/modules/search', '', '1', null, '2016-12-19 02:33:40', null);
INSERT INTO `tmu_sys_menus` VALUES ('6', '4', '图表组件', 'last-sub', '#/manager/modules/echarts', '', '1', null, '2016-12-19 02:42:04', null);
INSERT INTO `tmu_sys_menus` VALUES ('7', '4', '大屏组件', 'last-sub', '#/manager/modules/canvas', '', '1', null, '2016-12-19 02:37:06', null);
INSERT INTO `tmu_sys_menus` VALUES ('8', '3', '菜单管理', 'last-sub', '#/manager/menu', 'icon-align-justify', '1', '0', '2016-12-19 11:17:11', null);
INSERT INTO `tmu_sys_menus` VALUES ('9', '3', '通知管理', 'last-sub', '#/manager/notify', 'icon-comment', '1', '0', '2016-12-19 11:17:17', null);
INSERT INTO `tmu_sys_menus` VALUES ('10', '3', '超级管理员设置', 'last-sub', '#/manager/admin', 'icon-user', '1', '0', '2016-12-19 11:17:21', null);
INSERT INTO `tmu_sys_menus` VALUES ('11', '1', '业务管理', 'has-sub', '', 'icon-star', '1', null, '2016-12-19 11:17:26', null);
INSERT INTO `tmu_sys_menus` VALUES ('12', '1', '用户权限管理', 'has-sub', '', 'icon-key', '1', '0', '2016-12-19 11:17:31', null);
INSERT INTO `tmu_sys_menus` VALUES ('13', '11', '我的业务线', 'last-sub', '#/business', '', '1', null, '2016-12-19 03:29:25', null);
INSERT INTO `tmu_sys_menus` VALUES ('14', '11', '我的产品', 'last-sub', '#/product', '', '1', '0', '2016-12-18 19:29:25', null);
INSERT INTO `tmu_sys_menus` VALUES ('15', '12', '用户管理', 'last-sub', '#/power/user', '', '1', null, '2016-12-18 19:27:41', null);
INSERT INTO `tmu_sys_menus` VALUES ('16', '12', '用户组配置', 'last-sub', '#/power/group', '', '1', null, '2016-12-19 03:34:23', null);
INSERT INTO `tmu_sys_menus` VALUES ('17', '12', '权限配置', 'last-sub', '#/power/author', '', '1', '0', '2016-12-19 03:36:50', null);
INSERT INTO `tmu_sys_menus` VALUES ('18', '2', '监控管理', 'last-sub', '', 'icon-th', '1', null, '2016-12-19 11:17:35', null);
INSERT INTO `tmu_sys_menus` VALUES ('19', '18', '我的报表', 'last-sub', '#/report/tables', '', '1', null, '2016-12-20 14:22:19', null);
INSERT INTO `tmu_sys_menus` VALUES ('20', '18', '聚合监控', 'last-sub', '#/report/dashboard', '', '1', null, '2016-12-19 03:38:57', null);
INSERT INTO `tmu_sys_menus` VALUES ('21', '18', '大屏监控', 'last-sub', '#/report/theme', '', '1', null, '2016-12-19 03:39:20', null);
INSERT INTO `tmu_sys_menus` VALUES ('22', '13', '手机百度', 'last-sub', '', '', '1', null, '2016-12-19 13:20:15', null);

-- ----------------------------
-- Table structure for `tmu_sys_user`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_sys_user`;
CREATE TABLE `tmu_sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '用户名称',
  `nick` varchar(50) DEFAULT NULL COMMENT '用户昵称',
  `email` varchar(50) DEFAULT NULL COMMENT '用户邮箱',
  `level` varchar(50) DEFAULT NULL COMMENT '用户级别(1: 超级管理员, 3: 产品线管理员, 5: 普通用户)',
  `author` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `tmu_sys_user` VALUES ('1', 'panjian01', '', '','100','');
INSERT INTO `tmu_sys_user` VALUES ('2', 'v_tianbin', '', '','10','');
INSERT INTO `tmu_sys_user` VALUES ('3', 'v_liuyanqian', '', '','20','');
INSERT INTO `tmu_sys_user` VALUES ('4', 'v_jiangzewen', '', '','10','');
INSERT INTO `tmu_sys_user` VALUES ('5', 'v_liting', '', '','10','');
INSERT INTO `tmu_sys_user` VALUES ('6', 'v_xinhao', '', '','20','');
INSERT INTO `tmu_sys_user` VALUES ('7', 'v_wanghu', '', '','10','');
INSERT INTO `tmu_sys_user` VALUES ('8', 'jiaojiao', '', '','100','');
INSERT INTO `tmu_sys_user` VALUES ('9', 'baoge', '', '','100','');



-- ----------------------------
-- Records of tmu_sys_user
-- ----------------------------

-- ----------------------------
-- Table structure for `tmu_theme`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_theme`;
CREATE TABLE `tmu_theme` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '用户ID',
  `themeCategoryId` int(11) DEFAULT NULL COMMENT '主题分类id',
  `themeCategoryName` varchar(10) CHARACTER SET utf8 DEFAULT NULL COMMENT '主题分类名称',
  `themeId` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '主题模板ID',
  `themeName` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '主题名称',
  `themeType` int(1) DEFAULT '1' COMMENT '主题属性(1: 通用, 2: 专属)',
  `themeDetail` text CHARACTER SET utf8 COMMENT '主题简介',
  `status` int(1) DEFAULT NULL COMMENT '主题创建状态(1: 第一步, 2: 第二步, 3: 第三步, 9: 配置完成)',
  `updatetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(50) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`themeId`,`updatetime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of tmu_theme
-- ----------------------------
INSERT INTO `tmu_theme` VALUES ('1', '', '4', null, 'd41d8cd98f00b204e9800998ecf8427e', '测试', '1', '测试', null, '2016-12-04 03:33:30', null);

-- ----------------------------
-- Table structure for `tmu_theme_category`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_theme_category`;
CREATE TABLE `tmu_theme_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主题分类id',
  `name` varchar(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '主题分类名称',
  `updatetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tmu_theme_category
-- ----------------------------
INSERT INTO `tmu_theme_category` VALUES ('4', '黑色深邃', '2016-12-04 01:29:11', 'panjian01@baidu.com');
INSERT INTO `tmu_theme_category` VALUES ('6', '深蓝科幻', '2016-12-04 01:29:13', 'panjian01@baidu.com');
INSERT INTO `tmu_theme_category` VALUES ('7', '深黄机械', '2016-12-04 01:29:15', 'panjian01@baidu.com');
