# Unemate

| page | 交互 | 接口 | 说明 |
| --- | --- | --- | --- |
| 首页/index | getServerSideProps | /getViewInfo | 首页展示数据 |
|  | getServerSideProps | /getCategoryInfo | 首页展示数据   请求了两种类型 |
|  | getServerSideProps | /getTransactionInfo | 首页展示数据 |
| 登录/login | 登录按钮 | /getLoginNonce | 获取sign的相关参数 |
|  |  | /login | 登录 |
| 搜索/search | 顶部搜索 | /selectItemInfo | 获取搜索，过滤结果 |
|  | 过滤 | /selectItemInfo | 获取搜索，过滤结果 |
|  | 搜索结果加载更多 | /selectItemInfo | 获取搜索，过滤结果 |
|  | 收藏搜索结果 | /favoritesItem | 搜索结果收藏 |
| 邀请页/referral | 页面初始化 | /verifyInvitationCode | 获取某个链接？ |
|  | 按钮(Earn Rebates Immediately) | /invite | 校验？ |
| 用户/user/[id] | getServerSideProps | /getUserItemInfo | 用户信息 |
|  | 关注 | /follow | 关注用户(无法取消？) |
|  | 跳转twitter， Discord | /integralHandle | 积分操作 |
|  |  | /getStatisticsInfo | 获取统计数据 |
|  |  | /getRankingNum | 获取评级数量 |
|  |  | /openBlindbox | 开盲盒 |
|  |  | /favoritesItem | 收藏 |
|  |  | /getFavoritesInfo | 收藏列表 |
|  |  | /getUserBlindboxInfo | Mate Box tab 数据 |
|  |  | /getMyNftList | NFTs tab 数据 |
|  |  | /getFavoritesInfo | Favorites tab 数据 |
|  | withdrawal  btn | /extractRoyalties | 版税提现 |
|  |  | /getRoyaltiesList | 版税列表 |
|  |  | /getRoyaltiesTotalNum | 版税页面总计？ |
|  |  | /getWinInfo | 获取中奖信息 |
|  |  | /getUneRecord | 获取积分纪录 |
| /sell ？？？未对接 | getServerSideProps   请求了但没用 | /getCollectionItemInfo | ? |
|  | getServerSideProps | /getItemInfo | ? |
| /sell/create | submit | /createItem | 提交 |
|  | getServerSideProps | /getCollectionList | Collection select的option |
| /sell/[collection]/[id] | getServerSideProps | /getItemCurrencyType | 获取操作钱包的参数 |
|  | getServerSideProps |  /getItemInfo | 页面数据 |
|  |  | /getNftStatus | 获取NFT流程状态 |
|  |  | /getItemDetails |  |
|  |  | /freezeMetadata | 获取冻结元数据 |
|  |  | /getCreatedNftInfo |  |
|  |  | /sellItem | 提交购买数据 |
|  |  | /saveContractAddressV1 | 保存合约地址 |
|  |  | /saveNftInfo | 保存nft锻造信息 |
|  |  | /saveNftCreateInfo | 保存nft创建并锻造信息 ? |
|  |  | /saveNftApproveInfo | 保存nft授权信息 |
|  |  | /saveNftSellInfo | 保存nft上架信息 |
|  |  | /saveCreatedNftInfo | 保存nft创建完成时需要的上架信息 ? |
| /ranking |  | /rankingList | 获取nft排行数据 |
| 分佣/promotion |  | /getPromoterInfo | 推广者信息 |
|  |  | /getBulletinBoardData | 面板数据 |
|  |  | /getDefaultLink | 邀请链接信息 |
|  | 初始化 | /checkPromoter | 校验推广者 |
|  |  | /getLinkList | Invitation Link tab列表数据 |
|  |  | /getFriendsList | Associates List tab列表数据 |
|  |  | /getLinkData | Associates List tab数据 |
|  |  | /getRebateList | Rebate History tab列表数据 |
|  |  | /getRebateSuperiorList | Rebate History tab Upline select数据 |
|  |  | /getWithdrawalList | Withdrawal History tab 数据 |
|  |  | /createInvitationLink | 创建邀请 |
|  |  | /createInvitationPoster | 获取海报二维码链接 |
|  |  | /disableLink | invalid link |
|  |  | /getWithdrawInfo | 获取提现信息 |
|  |  | /updateLinkRemark | 修改remark |
| /promotion/apply |  | /applyPromoter | 创建 |
| /lucky-draw |  | /getLuckDrawList | 奖品列表 |
|  |  | /getWinnerList	 | 中奖名单 |
| /lucky-draw/hanazawa | 初始化 | /getLuckDrawData | 获取抽奖活动详情 |
|  | 初始化。若钱包已连接则请求 | /getActivityAuditInfo | 获取特殊活动信息 |
|  |  | /editApplyActivity | 修改参加活动 |
|  |  | /applyActivity | 申请参加 |
|  |  | /getWinnerList | 中奖名单 |
| /lucky-draw/detail | 初始化 | /getLuckDrawData | 获取抽奖活动详情 |
|  | 初始化 | /getLuckDrawInfo |  |
|  | Exchange btn | /exchangeLuckDraw | 兑换 |
|  |  | /likesLuckDraw | 点赞 |
|  | 点赞后请求 | /integralHandle | 积分操作 |
| /collections | getServerSideProps | /getCollectionList | 列表数据 |
|  | 列表项 | /releaseBlindbox |  |
|  | 列表项 | /editPrice |  |
|  | 列表项 | /newReleaseBlindbox |  |
| /collections/[id] | getServerSideProps | /getCollectionItemInfo | 列表数据 |
|  | getServerSideProps | /getCollectionInfo | 页面数据 |
|  | 初始化 | /getCollectionScore |  |
|  | Rate the NFT Collections modal Subscribe btn | /collectionScore |  |
|  | 列表项的操作 | /favoritesItem | 收藏 |
|  | facebook,twitter,google btn | /integralHandle | 积分操作 |
| /collections/important | submit | /importContract |  |
|  | ？未使用 | /getImportStatus |  |
| /collections/edit/[id] | getServerSideProps | /getCollectionInfo | 页面详情数据 |
|  | submit | /updateCollection |  |
|  | 在上面submit操作里使用 | /createCollectionContract |  |
|  | 在上面submit操作里使用，错误异常时调用 | /cancelCollection |  |
|  | 输入name input 时请求 | /checkCollectionName | 校验name是否可以使用 |
|  | 输入URL on UneMeta input时请求 | /checkCollectionUrl | 校验urk是否可以使用 |
| /collections/detail |  |  |  |
| /collections/create | submit | /createCollection |  |
|  | 在上面submit操作里使用，错误异常时调用 | /cancelCollection |  |
|  | 在上面submit操作里使用 | /createCollectionContract |  |
|  |  | /checkCollectionName | 校验name是否可以使用 |
|  |  | /checkCollectionUrl | 校验urk是否可以使用 |
| /collection/metapass | more btn。？逻辑不通 | /selectCollectionInfo |  |
|  | getServerSideProps | /getCuratedDropsList | 列表数据 |
|  | 列表项 | /releaseBlindbox |  |
|  | 列表项 | /editPrice |  |
| /collection/curateddrops | getServerSideProps | /getCuratedDropsList | 列表数据 |
|  | more btn   ？逻辑不通 | /selectCollectionInfo |  |
|  | 列表项 | /releaseBlindbox |  |
|  | 列表项 | /editPrice |  |
| /collection/[id] | getServerSideProps | /selectCollectionInfo | 列表数据 |
|  | more btn | /selectCollectionInfo |  |
|  | listItem组件。列表项 | /releaseBlindbox |  |
|  | listItem组件。列表项 | /editPrice |  |
|  | listItem组件。列表项 | /newReleaseBlindbox |  |
|  | facebook,twitter,google btn | /integralHandle | 积分操作 |
| /asset | getServerSideProps  请求了但没用? | /getCollectionItemInfo |  |
|  | getServerSideProps | /getItemInfo |  |
| /asset/edit/[id] | getServerSideProps | /itemCollectionList |  |
|  | getServerSideProps | /getItemInfo |  |
|  | submit | /updateItem | 提交 |
| /asset/create | getServerSideProps   | /itemCollectionList | 表单中 collection的选项 |
|  | submit | /createItem | 提交 |
| /asset/[collection]/[id] | getServerSideProps | /getItemInfo | 请求页面的数据 |
|  | getServerSideProps好像没必要放这里  其他方法中又再次请求了 | /getItemDetails | 钱包交互需要用到的数据，页面中的判断条件，数据展示 |
|  | getServerSideProps  | /getCreatedNftInfo | 钱包交互需要用到的数据 |
|  | getServerSideProps
加载更多 | /getItemCommentInfo | comment数据 |
|  | getServerSideProps | /getOfferInfo | tab = 7 用到的数据 |
|  | getServerSideProps | /getListingsInfo | tab = 8 用到的数据 |
|  |  | /favoritesItem | 收藏。 callback 有些情况重新请求了  /getItemInfo |
|  | Place a Bid 弹窗的按钮操作 | /getItemCurrencyType | 获取操作钱包需要的数据 |
|  | buyNft用到 | /checkSession |  |
|  | buyNft用到 | /getItemCurrencyType
/getBlindboxTokenAddress | 拿到两个接口的数据 去操作钱包 |
|  |  | /saveNftBuyApproveInfo | 保存nft购买授权信息  购买操作中使用 |
|  |  | /saveNftBuyInfo | 保存nft购买信息。购买操作中使用 |
|  |  | /saveBlindboxBuyInfo | 保存新盲盒购买信息  保存新盲盒购买信息 |
|  | Send comment 操作 | /saveItemCommentInfo |  |
|  | Cancel Bid 操作 | /canceloffer |  |
|  | Add Supply Num弹窗 add操作 | /addSupplyNum |  |
|  |  | integralHandle | 积分操作 |
| /asset/[collection]/bak | getServerSideProps | /getItemInfo |  |
|  | getServerSideProps | /getItemDetails |  |
|  | getServerSideProps | /getCreatedNftInfo |  |
|  |  | /favoritesItem | 收藏 |
|  |  | /getItemCurrencyType
/getBlindboxTokenAddress | 拿到两个接口的数据 去操作钱包 |
|  |  | /saveNftBuyApproveInfo | 保存nft购买授权信息  购买操作中使用 |
|  |  | /saveNftBuyInfo | 保存nft购买信息。购买操作中使用 |
| /album/[id] | getServerSideProps | /getAlbumInfo | 页面信息 |
|  | getServerSideProps | /getAlbumCommentInfo | comment data |
|  | Send comment btn | /saveAlbumCommentInfo |  |
| /account/profile | getServerSideProps | /getUserInfo | 用户信息 |
|  | submit | /saveUserInfo | 保存用户信息 |
| /account/offers | getServerSideProps | /getOfferSettingsInfo |  |
|  | submit | /saveOfferSettingsInfo |  |
| /account/notifications | getServerSideProps | /getNoticeSettings |  |
|  | submit | /saveNoticeSettings |  |
| /account/notification | getServerSideProps | /getIntegralInfo | Notification列表 |
|  | getServerSideProps | /getBuyItemNotice | commnets列表 |
|  | getServerSideProps | /getCollectionNotice | trade列表 |
|  | getServerSideProps | /getGiveItemNotice | rewards列表 |
| /account/invitation |  |  |  |
| 其他 |  | /upLoadImage | 上传视频和图片 |
|  |  | /upLoadFile | 上传文件 |
| footer | 初始化 | /getGiveItemNotice |  |
|  |  | /readGiveItemNotice |  |
| header |  | /getIntegralInfo |  |
|  |  | /getCollectionNotice |  |
|  |  | /getGiveItemNotice |  |
|  |  | /getBuyItemNotice |  |
|  |  | /readGiveItemNotice |  |
|  |  | /readNotice |  |
|  |  | /readIntegralInfo |  |
|  |  | /readBuyItemNotice |  |
|  |  | /readGiveItemNotice |  |
|  |  | /emptyNotice |  |
|  |  | /getVersionInfo |  |
|  |  | /getNoticeTotalNum |  |
|  |  | /getLoginNonce |  |
|  |  | /login |  |
|  |  | /loginOut |  |
|  |  | /selectItemRelation |  |
|  |  |  |  |