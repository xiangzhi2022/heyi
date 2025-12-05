// 模拟后端存储，使用 localStorage 持久化数据

const STORAGE_KEY = 'heyi_assets_data_v2'; // Update key to avoid conflicts with old data structure

// --- 辅助函数：生成随机数据 ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

const ASSET_TYPES = ['image', 'music', 'video', 'text'];
const IMAGE_COLORS = ['bg-green-200', 'bg-blue-200', 'bg-purple-200', 'bg-red-200', 'bg-yellow-200', 'bg-gray-200', 'bg-indigo-200', 'bg-pink-200', 'bg-orange-200', 'bg-cyan-200', 'bg-teal-200', 'bg-slate-200', 'bg-rose-200', 'bg-violet-200'];
const AUTHORS = ['李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', 'NeoArtist', 'InkMaster', 'VArchitect', 'ArtBot', 'OceanLens', '宫商角徵羽', 'MetaArchitect', 'PianoMaster', '3DArtist', '剧本大师', '历史迷', '温情笔触', '影像工作室', '舞动人生'];
const COLLECTIONS = ['东方美学系列', '赛博朋克系列', '现代设计', '品牌资产', '元宇宙地块', '心灵音乐', 'GameAssets', '爽文短剧', '古装悬疑', '治愈系列', '科幻音乐', '科幻影视', '现代艺术', '纪录片', '传统音乐', '虚拟建筑', '古典音乐', '微电影', '舞蹈艺术'];
const SALES_MODES_POOL = [
    ['direct'],
    ['license'],
    ['auction'],
    ['lease'],
    ['direct', 'license'],
    ['direct', 'auction'],
    ['direct', 'lease'],
    ['license', 'lease'],
    ['auction', 'lease'],
    ['direct', 'license', 'auction'],
    ['direct', 'license', 'lease'],
    ['auction', 'lease', 'license'],
    ['direct', 'auction', 'lease', 'license'], // 所有模式
];
const LICENSE_TYPES_POOL = ['personal', 'commercial', 'copyright', 'exclusive'];
const LEASE_DURATIONS = ['1', '3', '6', '12', '24'];

const getRandomDescription = () => {
    const intros = ["这是一幅展现", "探索", "融合了", "适合", "位于", "一段舒缓的", "高精度", "一部", "考据严谨的", "温馨治愈的", "史诗级"];
    const themes = ["中国传统山水意境", "未来的霓虹都市", "现代极简主义风格", "家居装饰", "元宇宙核心商业区", "钢琴旋律", "次世代游戏", "都市逆袭", "古装悬疑", "单元剧"];
    const endings = ["数字艺术作品。", "城市景观。", "完美结合。", "海报设计。", "的黄金地块。", "背景音乐。", "角色模型。", "短剧剧本。", "探案剧本。", "系列剧本。", "电影原声。"];
    return `${getRandomElement(intros)}${getRandomElement(themes)}${getRandomElement(endings)}`;
};

const getRandomProperties = () => {
    const props = [];
    if (Math.random() > 0.5) props.push({ type: "风格", value: getRandomElement(["水墨", "赛博朋克", "极简", "抽象"]) });
    if (Math.random() > 0.5) props.push({ type: "年代", value: getRandomElement(["2023", "2024", "2077"]) });
    if (Math.random() > 0.5) props.push({ type: "稀有度", value: getRandomElement(["普通", "稀有", "史诗", "传奇"]) });
    return props;
};

const getRandomPriceHistory = () => {
    const history = [];
    let currentPrice = getRandomInt(1000, 10000);
    for (let i = 0; i < 6; i++) {
        history.push({ date: `${i + 1}月`, price: currentPrice });
        currentPrice += getRandomInt(-500, 1000);
        if (currentPrice < 100) currentPrice = 100;
    }
    return history;
};

/**
 * 根据资产类型和ID生成真实的图片URL
 * @param {string} type - 资产类型
 * @param {number} id - 资产ID
 * @returns {string} - 图片URL
 */
const getAssetImage = (type, id) => {
    // 使用 Picsum Photos 作为主要图源，因为它稳定且速度快
    // 使用 seed 确保同一个 ID 总是对应同一张图片
    const baseUrl = `https://picsum.photos/seed/${id}/400/400`;

    // 如果需要更具针对性的图片，可以使用 LoremFlickr (注意：可能会比 Picsum 慢)
    // const keywordMap = {
    //     'music': 'music,instrument',
    //     'video': 'cinema,movie',
    //     'literature': 'book,paper',
    //     'image': 'art,abstract'
    // };
    // if (keywordMap[type]) {
    //     return `https://loremflickr.com/400/400/${keywordMap[type]}?lock=${id}`;
    // }

    return baseUrl;
};

/**
 * 生成单个随机资产的函数
 * @param {number} id - 资产ID
 * @returns {object} - 随机生成的资产对象
 */
const generateRandomAsset = (id) => {
    const titlePrefixes = ['创意', '数字', '未来', '幻彩', '永恒', '深度', '流光', '编码', '星辰'];
    const assetType = getRandomElement(ASSET_TYPES);
    const author = getRandomElement(AUTHORS);
    const owner = Math.random() > 0.5 ? author : getRandomElement(AUTHORS); // 有一半几率作者就是拥有者

    const basePrice = getRandomInt(100, 10000);
    const salesModes = getRandomElement(SALES_MODES_POOL);

    const asset = {
        id: id,
        title: `${getRandomElement(titlePrefixes)}${id.toString().padStart(3, '0')}`,
        collection: getRandomElement(COLLECTIONS),
        author: author,
        owner: owner,
        price: (basePrice + getRandomInt(0, 5000)).toLocaleString(), // 默认价格，根据模式会有变化
        currency: "CNY",
        imageColor: getRandomElement(IMAGE_COLORS),
        imageUrl: getAssetImage(assetType, id), // 添加真实图片URL
        likes: getRandomInt(10, 1000),
        views: getRandomInt(100, 5000),
        type: assetType,
        isListed: Math.random() > 0.1, // 90% 的几率已上架
        description: getRandomDescription(),
        properties: getRandomProperties(),
        history: [], // 简化历史记录
        priceHistory: getRandomPriceHistory(),
        salesModes: salesModes,
        isFullCopyrightTransfer: Math.random() > 0.7, // 30% 几率包含完整版权转让
        licenseTypes: salesModes.includes('license') ? Array.from(new Set(Array(getRandomInt(1, 3)).fill(0).map(() => getRandomElement(LICENSE_TYPES_POOL)))) : [],
        auctionSettings: salesModes.includes('auction') ? {
            startPrice: getRandomInt(basePrice * 0.8, basePrice).toLocaleString(),
            reservePrice: Math.random() > 0.5 ? getRandomInt(basePrice, basePrice * 1.2).toLocaleString() : '',
            duration: getRandomElement(['1', '3', '7', '14']),
            startTime: ''
        } : { startPrice: '', reservePrice: '', duration: '7', startTime: '' },
        leaseSettings: salesModes.includes('lease') ? {
            price: getRandomInt(basePrice * 0.1, basePrice * 0.3).toLocaleString(),
            duration: getRandomElement(LEASE_DURATIONS)
        } : { price: '', duration: '1' }
    };

    // 如果销售模式是直售，并且包含完整版权转让，则调整价格描述
    if (asset.salesModes.includes('direct') && asset.isFullCopyrightTransfer) {
        asset.price = (basePrice * 2 + getRandomInt(0, 5000)).toLocaleString(); // 完整版权转让价格更高
    }

    return asset;
};

// 动态生成大量模拟数据
const generateInitialAssets = (count) => {
    const assets = {};
    for (let i = 1; i <= count; i++) {
        const asset = generateRandomAsset(i);
        assets[i] = asset;
    }
    return assets;
};

const ASSET_COUNT = 80; // 生成的资产数量
const INITIAL_ASSETS = generateInitialAssets(ASSET_COUNT);

export const getAsset = (id) => {
    const assets = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || INITIAL_ASSETS;
    return assets[id] || null;
};

export const saveAsset = (asset) => {
    const assets = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || INITIAL_ASSETS;
    assets[asset.id] = { ...assets[asset.id], ...asset };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets[asset.id];
};

export const getAllAssets = () => {
    const assets = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || INITIAL_ASSETS;
    return Object.values(assets);
};
