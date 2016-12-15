/*
 Navicat MySQL Data Transfer

 Source Server         : 天幕
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : localhost
 Source Database       : bd_tianmu_visual_platform

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : utf-8

 Date: 12/04/2016 03:34:47 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tmu_category`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_category`;
CREATE TABLE `tmu_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主题分类id',
  `name` varchar(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '主题分类名称',
  `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tmu_category`
-- ----------------------------
BEGIN;
INSERT INTO `tmu_category` VALUES ('4', '黑色深邃', '2016-12-04 01:29:11', 'panjian01@baidu.com'), ('6', '深蓝科幻', '2016-12-04 01:29:13', 'panjian01@baidu.com'), ('7', '深黄机械', '2016-12-04 01:29:15', 'panjian01@baidu.com');
COMMIT;

-- ----------------------------
--  Table structure for `tmu_echarts`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_echarts`;
CREATE TABLE `tmu_echarts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'echarts图表名称',
  `echartsName` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'echarts key(跟echarts官网保持一致)',
  `option` longtext CHARACTER SET utf8 NOT NULL COMMENT 'echarts图表默认option (JSON)',
  `config` text CHARACTER SET utf8 COMMENT 'echarts图表默认配置(JSON)',
  `updatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '操作人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `tmu_modules`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_modules`;
CREATE TABLE `tmu_modules` (
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
  `updatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(200) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`themeId`,`elementId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `tmu_scene`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_scene`;
CREATE TABLE `tmu_scene` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sceneId` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '场景ID',
  `echartsTheme` text CHARACTER SET utf8 COMMENT '自定义echarts主题配置(json)',
  `ratio` varchar(20) CHARACTER SET utf8 DEFAULT '' COMMENT '场景宽高比例(4:3/16:9/16:10/自定义:输入宽度高度自动计算得到比例)',
  `background` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '背景图片(本地图片, 上传到服务器)',
  `backgroundColor` varchar(13) DEFAULT NULL COMMENT '背景颜色  255, 255, 255',
  `alpha` int(11) DEFAULT '1' COMMENT '透明度(0 - 1)',
  `updatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(20) NOT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`sceneId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `tmu_theme`
-- ----------------------------
DROP TABLE IF EXISTS `tmu_theme`;
CREATE TABLE `tmu_theme` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uid` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '用户ID',
  `themeCategoryId` int(11) DEFAULT NULL COMMENT '主题分类id',
  `themeId` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '主题模板ID',
  `themeName` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '主题名称',
  `themeType` int(1) DEFAULT '1' COMMENT '主题属性(1: 通用, 2: 专属)',
  `themeDetail` text CHARACTER SET utf8 COMMENT '主题简介',
  `themeEchartsOption` longtext CHARACTER SET utf8,
  `sceneId` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '默认场景ID (使用hash生成的key, 不使用自动递增id)',
  `status` int(1) DEFAULT NULL COMMENT '主题创建状态(1: 第一步, 2: 第二步, 3: 第三步, 9: 配置完成)',
  `updatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `editor` varchar(50) DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`,`themeId`,`updatetime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- ----------------------------
--  Records of `tmu_theme`
-- ----------------------------
BEGIN;
INSERT INTO `tmu_theme` VALUES ('1', '', '4', 'd41d8cd98f00b204e9800998ecf8427e', '测试', '1', '测试', '{\n\"a\": \"啊啊啊啊啊啊啊啊啊啊\",\n\"b\": [1, 2, 3, 4, 5]\n}', null, null, '2016-12-04 03:33:30', null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
