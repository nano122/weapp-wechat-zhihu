const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '图片URL'
    },
    link_type: {
        type: DataTypes.STRING(20),
        defaultValue: 'url',
        comment: '链接类型: question/answer/url'
    },
    link_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '链接目标ID'
    },
    link_url: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '外部链接URL'
    },
    sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '排序'
    },
    is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        comment: '是否启用'
    }
}, {
    tableName: 'banners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['is_active'] },
        { fields: ['sort_order'] }
    ]
});

module.exports = Banner;
