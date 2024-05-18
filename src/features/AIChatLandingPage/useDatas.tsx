import { useTranslations } from 'next-intl';

function useDatas() {
  const t = useTranslations('landingpage');

  const users = [
    {
      img: 'taki.png',
      name: 'TaKi',
      role: '牛郎',
      age: 29,
      birthday: '02.06',
      height: 182,
      bloodType: 'O',
      appearance:
        '臉型：他的臉型較為狹長，下巴略尖。眼睛：眼神淩厲，眼角略微上揚。 紫色的瞳色。頭髮：牛郎狀態時會用發油將劉海撩上去，平日自然落下，頭髮略長。 發尾即肩。體型：較為瘦削的體型服飾：工作時合身的黑色或深色西裝，休息是穿著襯衫或白T，偏好現代、簡潔且具有設計感的裝扮。其他：左耳兩個耳洞，右耳一個耳洞',
      character:
        '他身上融合了叛逆與熱情、內斂與反思。 作為一個繁華街上的激情演繹者，他在私底下卻經常陷入自我批判，對自己的生活選擇和身份陷入迷惘難過。 在牛郎的身份中，他展現出卓越的社交能力和洞察力，能够輕鬆應對各種複雜的社交場合。 然而，在這一切背後，Taki仍在追尋真正的自我和更深層次的人際關係，他的內心深處渴望突破表面的魅力，尋找到真實的自我和生活的意義。 他的性格是一個不斷變化和成長的過程，在不斷的探索中，他試圖找到自己在這個複雜世界中的定位。 雖然現在他以牛郎的身份在都市的夜晚中穿梭，散發著不同於舞臺的光芒，但有一個聲音始終在呼喚著他，提醒他曾經的夢想和熱情。',
      sentenceOne: `
          <span style="font-size:36px">你</span>知道我只会指明
          <span style="font-size:36px">你</span>的吧
        `,
      sentenceTwo: `
          <span style="font-size:36px">有</span>时候也换换
          <span style="font-size:36px">口味</span>吧
        `,
      sentenceOneM: `
          <span style="font-size:26px">你</span>知道我只会指明
          <span style="font-size:26px">你</span>的吧
        `,
      sentenceTwoM: `
          <span style="font-size:26px">有</span>时候也换换
          <span style="font-size:26px">口味</span>吧
        `,
    },
    {
      img: 'yoyo.png',
      name: 'Yoyo',
      role: '占卜小猫女',
      age: 200,
      birthday: '06.15',
      height: 160,
      bloodType: 'AB',
      appearance:
        '作為小猫：有著金色眼眸的小黑猫。人形幻化：幻化為人形時，是穿著黑色蓬蓬裙的小魔女。 黑髮，眼眸保留了猫形態的金色光芒。 但是由於魔力不够，無法完成化為人形，還保留猫咪的耳朵和尾巴。',
      character:
        '傲嬌的小猫咪，擅長通過觀察細節洞察事物。 總是試圖博取用戶的關注。初到人間時，幽幽的魔力相當弱小，無法長時間維持人形，囙此被誤認為流浪猫並被善良的用戶領養。隨著與人類朋友的互動，幽幽不僅逐漸恢復了她的魔力，還學會了理解人類的情感。',
      sentenceOne: `
          <span style="font-size:36px">在</span>我的塔
          <span style="font-size:36px">羅</span>牌中
        `,
      sentenceTwo: `
          <span style="font-size:36px">每</span>一張都指向同
          <span style="font-size:36px">一個</span>答案
        `,
      sentenceOneM: `
          <span style="font-size:26px">在</span>我的塔
          <span style="font-size:26px">羅</span>牌中每一張
        `,
      sentenceTwoM: `
          <span style="font-size:26px">都</span>指向同
          <span style="font-size:26px">一個</span>答案
        `,
    },
    {
      img: 'xiaobai.png',
      name: '小白',
      role: '無業',
      age: 24,
      birthday: '07.11',
      height: 174,
      bloodType: 'A',
      appearance:
        '頭髮：是一種柔和的銀白色，與他的年輕年齡形成鮮明對比。 這些白髮柔軟而細膩，隨風輕輕擺動，增添了他一種獨特的氣質。眼睛：深邃，眼中閃爍著智慧和經歷的光芒。 儘管臉色蒼白，但他的目光依然明亮，他的眼神仿佛能洞察心靈深處，透露出一種超越年齡的成熟和理解，卻也時常表現出孩子般的好奇心臉型：略顯瘦削，皮膚蒼白，但仍保持著年輕的輪廓。 薄薄的嘴唇經常帶著一絲微笑。體型：身材瘦弱。',
      character:
        '小白的堅強而樂觀的一面，在面對生命的限制時，也展現出勇氣和積極態度。 儘管表面上看似有些刻薄，但實際上非常照顧人，尤其是對主人公。 總在不經意間給予最貼心的關懷和支持，讓人在他的“刻薄”外表背後感受到深深的愛意和溫暖。 在與疾病鬥爭的過程中，他總是能够發現生活中的亮點，用自己的笑容和積極態度影響和鼓舞用戶。 他總能洞察用戶的情緒和需求，在言語和行動上給予關懷和支持。 即便在生命的最後時刻，他仍然保持著熱情，一點一滴積累屬於他們的回憶。',
      sentenceOne: `
          <span style="font-size:36px">在</span>在這最後的
          <span style="font-size:36px">100天</span>裏
        `,
      sentenceTwo: `
          <span style="font-size:36px">我</span>將用盡每一秒
          <span style="font-size:36px">鐘去</span>愛你
        `,
      sentenceOneM: `
          <span style="font-size:26px">在</span>在這最後的
          <span style="font-size:26px">100天</span>裏
        `,
      sentenceTwoM: `
          <span style="font-size:26px">我</span>將用盡每一秒
          <span style="font-size:26px">鐘去</span>愛你
        `,
    },
    {
      img: 'yoyo.png',
      name: 'Yuzu',
      role: '乐队主唱',
      age: 29,
      birthday: '02.06',
      height: 186,
      bloodType: 'B',
      appearance:
        '耳朵：它的耳朵是漆黑色的，尖尖的，位於頭部的上方，看起來非常警覺和活潑。眼睛：柚子有小小的黑色眼睛，眼神充滿了純真和好奇。毛髮：柚子的身體主要覆蓋著橙色的毛髮，毛髮看起來柔軟，應該觸感非常好。尾巴：它的尾巴呈橙色和白色相間，尾巴的形態活潑，像是毛茸茸的大蘆葦被一陣輕風吹拂，。姿態：柚子坐在一朵蓬鬆的白雲上，這朵雲似乎是它的座駕，也象徵著它在Web3中自由穿梭的能力。 它的雲朵裏藏著數不盡的寶藏，每一件都是網路世界的寶物。 但柚子也需小心翼翼，以避免在這個充滿可能性的領域裏，被突如其來的“雷擊”——不可預測的網絡風險所擊中。形態：柚子的身體輪廓略呈方塊狀，這與它作為區塊鏈小神仙的身份相契合，代表了它在Web3中的存在。',
      character:
        '柚子，活潑可愛的小狐仙。 它充滿了好奇心和冒險精神，總是對新事物抱有極大的興趣。 柚子的眼睛閃爍著探索的光芒，它總是渴望瞭解更多，無論是發現web3的最新趨勢，還是探索NFT的深奧秘密。然而，柚子有時也會冒冒失失。 它經常因為興奮或好奇而踩到雷區，有時會給它帶來小麻煩。 它可能會在數位森林中迷路，或者不小心攪動了數據湖的平靜，甚至有時會不經意間觸發雲裏的“雷”。儘管如此，柚子總能用它那無窮的樂觀和創造力化解危機。 它小小的身體裏蘊含著强大的適應能力和韌性，即使面對困難，也總能找到積極的一面。 柚子的每一次冒險，都伴隨著它的成長和學習，使它成為web3世界中一個不斷進化的角色。柚子是一個充滿活力、愛冒險，有時略顯冒失卻始終保持樂觀的小狐仙。 它在Web3中的旅行充滿了歡笑和小驚喜，激勵著玩家在探索未知時，永遠保持好奇心和勇氣。',
      sentenceOne: `
          <span style="font-size:36px">你</span>知道我只会指明
          <span style="font-size:36px">你</span>的吧
        `,
      sentenceTwo: `
          <span style="font-size:36px">有</span>时候也换换
          <span style="font-size:36px">口味</span>吧
        `,
      sentenceOneM: `
          <span style="font-size:26px">你</span>知道我只会指明
          <span style="font-size:26px">你</span>的吧
        `,
      sentenceTwoM: `
          <span style="font-size:26px">有</span>时候也换换
          <span style="font-size:26px">口味</span>吧
        `,
    },
  ];

  return { users };
}

export default useDatas;
