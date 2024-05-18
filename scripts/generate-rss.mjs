import { writeFileSync, createWriteStream } from 'fs';
import axios from 'axios';

async function generate() {
    try {
        const fileUrl = 'https://storage.googleapis.com/unemeta_sitemap/sitemap1.xml';
        const fileStream = createWriteStream('public/sitemap1.xml');
        const response = await axios.get(fileUrl, { responseType: 'stream' })
        response.data.pipe(fileStream);
        return new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });
    } catch (error) {
        console.error('下载文件失败:', error);
        throw error;
    }

}

generate();