import { useMemo, useState } from "react";
import "./App.css";

// 雇用形態
const EMPLOYMENT_TYPES = ["正社員", "契約社員", "アルバイト"];

// 都道府県一覧
const PREFECTURES = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県",
  "鹿児島県", "沖縄県"
];

// 都道府県ごとの地域選択肢
const AREA_OPTIONS: Record<string, string[]> = {
  "北海道": ["札幌市", "旭川市", "函館市", "小樽市", "その他"],
  "宮城県": ["仙台市", "石巻市", "大崎市", "その他"],
  "埼玉県": ["さいたま市", "川越市", "川口市", "所沢市", "その他"],
  "千葉県": ["千葉市", "船橋市", "柏市", "松戸市", "その他"],
  "東京都": ["新宿区", "渋谷区", "千代田区", "港区", "豊島区", "八王子市", "立川市", "その他"],
  "神奈川県": ["横浜市", "川崎市", "相模原市", "藤沢市", "横須賀市", "その他"],
  "新潟県": ["新潟市", "長岡市", "上越市", "その他"],
  "静岡県": ["静岡市", "浜松市", "沼津市", "その他"],
  "愛知県": ["名古屋市", "豊田市", "岡崎市", "一宮市", "その他"],
  "京都府": ["京都市", "宇治市", "亀岡市", "その他"],
  "大阪府": ["大阪市", "堺市", "豊中市", "東大阪市", "その他"],
  "兵庫県": ["神戸市", "姫路市", "西宮市", "尼崎市", "その他"],
  "広島県": ["広島市", "福山市", "呉市", "その他"],
  "福岡県": ["福岡市", "北九州市", "久留米市", "その他"],
  "沖縄県": ["那覇市", "沖縄市", "うるま市", "その他"]
};

// 求人データ（サンプル）
type Job = {
  id: number;
  company: string;
  title: string;
  employment: string;
  prefecture: string;
  area: string;
  salary: string;
  description: string;
  tags: string[];
  date: string;
};

const JOBS: Job[] = [
  {
    id: 1,
    company: "株式会社サンプルテック",
    title: "Webデザイナー・サイト制作",
    employment: "正社員",
    prefecture: "東京都",
    area: "新宿区",
    salary: "月給28万円〜40万円",
    description: "Webサイトのデザイン・制作、HTML・CSSを使用したコーディング業務。",
    tags: ["未経験歓迎", "土日祝休み", "リモート相談可"],
    date: "2026/11/10"
  },
  {
    id: 2,
    company: "株式会社グリーンオフィス",
    title: "一般事務・データ入力",
    employment: "契約社員",
    prefecture: "神奈川県",
    area: "横浜市",
    salary: "月給23万円〜28万円",
    description: "書類作成、データ入力、電話・メール対応などの事務業務。",
    tags: ["残業少なめ", "駅チカ", "社会保険完備"],
    date: "2026/11/09"
  },
  {
    id: 3,
    company: "カフェ・リーフ",
    title: "カフェスタッフ",
    employment: "アルバイト",
    prefecture: "東京都",
    area: "渋谷区",
    salary: "時給1,350円〜",
    description: "接客、レジ、ドリンク作成、店内清掃などをお任せします。",
    tags: ["週2日からOK", "未経験歓迎", "シフト自由"],
    date: "2026/11/08"
  },
  {
    id: 4,
    company: "株式会社ネクストワーク",
    title: "人事・労務スタッフ",
    employment: "正社員",
    prefecture: "大阪府",
    area: "大阪市",
    salary: "月給25万円〜35万円",
    description: "給与計算、社会保険手続き、勤怠管理などの人事労務業務。",
    tags: ["経験者優遇", "年間休日120日", "駅チカ"],
    date: "2026/11/07"
  },
  {
    id: 5,
    company: "札幌フードサービス",
    title: "店舗運営・販売スタッフ",
    employment: "契約社員",
    prefecture: "北海道",
    area: "札幌市",
    salary: "月給22万円〜",
    description: "店舗での接客・販売、商品管理、売場づくりなど。",
    tags: ["交通費支給", "シフト制", "研修あり"],
    date: "2026/11/06"
  },
  {
    id: 6,
    company: "株式会社名古屋ソリューション",
    title: "ITサポート・ヘルプデスク",
    employment: "正社員",
    prefecture: "愛知県",
    area: "名古屋市",
    salary: "月給24万円〜32万円",
    description: "社内システムの問い合わせ対応、PC設定、IT関連のサポート業務。",
    tags: ["未経験相談可", "研修充実", "土日祝休み"],
    date: "2026/11/05"
  },
  {
    id: 7,
    company: "株式会社さいたま物流",
    title: "倉庫内作業スタッフ",
    employment: "アルバイト",
    prefecture: "埼玉県",
    area: "さいたま市",
    salary: "時給1,250円〜",
    description: "商品の仕分け、検品、梱包などの倉庫内作業。",
    tags: ["週3日からOK", "未経験歓迎", "車通勤可"],
    date: "2026/11/04"
  },
  {
    id: 8,
    company: "福岡ビジネスサポート",
    title: "営業アシスタント",
    employment: "契約社員",
    prefecture: "福岡県",
    area: "福岡市",
    salary: "月給21万円〜26万円",
    description: "営業資料作成、見積書作成、顧客情報の管理など。",
    tags: ["土日祝休み", "残業少なめ", "服装自由"],
    date: "2026/11/03"
  }
];

function App() {
  // 検索条件
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // 都道府県を変更したとき、地域選択をリセット
  const handlePrefectureChange = (value: string) => {
    setPrefecture(value);
    setArea("");
  };

  // 雇用形態の選択・解除
  const toggleEmployment = (type: string) => {
    setEmploymentTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  };

  // お気に入りの登録・解除
  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  // 地域選択肢
  const areas = prefecture
    ? AREA_OPTIONS[prefecture] || ["県内全域", "主要都市", "その他"]
    : [];

  // 条件に合う求人を抽出
  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesEmployment =
        employmentTypes.length === 0 ||
        employmentTypes.includes(job.employment);

      const matchesPrefecture =
        !prefecture || job.prefecture === prefecture;

      const matchesArea =
        !area ||
        area === "県内全域" ||
        (area === "その他"
          ? job.area === "その他"
          : job.area === area);

      const searchText =
        `${job.title} ${job.company} ${job.description} ${job.tags.join(" ")}`.toLowerCase();

      const matchesKeyword =
        !keyword.trim() ||
        searchText.includes(keyword.trim().toLowerCase());

      return (
        matchesEmployment &&
        matchesPrefecture &&
        matchesArea &&
        matchesKeyword
      );
    });
  }, [employmentTypes, prefecture, area, keyword]);

  // 検索条件のクリア
  const clearFilters = () => {
    setEmploymentTypes([]);
    setPrefecture("");
    setArea("");
    setKeyword("");
  };

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="site-header">
        <div className="header-inner">
          <a className="logo" href="#">
            <span className="logo-icon">W</span>
            <span>WORK<span className="logo-accent">NAVI</span></span>
          </a>

          <nav className="header-nav">
            <a href="#search">求人を探す</a>
            <a href="#jobs">求人一覧</a>
            <a href="#about">サービスについて</a>
          </nav>

          <a className="header-button" href="#search">
            求人を検索する
          </a>
        </div>
      </header>

      {/* メインビジュアル */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-label">YOUR NEXT CAREER STARTS HERE</span>
            <h1>
              あなたに合った仕事を、
              <br />
              <span>ここから見つけよう。</span>
            </h1>
            <p>
              働き方も、勤務地も、自分らしく。
              <br />
              あなたの希望に合った求人を探せます。
            </p>
            <a href="#search" className="hero-button">
              求人を探す <span>→</span>
            </a>
          </div>

          <div className="hero-visual">
            <div className="visual-circle circle-one" />
            <div className="visual-circle circle-two" />
            <div className="visual-card">
              <div className="visual-card-top">
                <span>YOUR CAREER</span>
                <span className="visual-dot">●</span>
              </div>
              <div className="visual-illustration">
                <div className="person-head" />
                <div className="person-body" />
                <div className="person-laptop" />
              </div>
              <div className="visual-card-bottom">
                <strong>新しい一歩を。</strong>
                <span>Find your future</span>
              </div>
            </div>
            <div className="floating-tag">理想の働き方を探そう</div>
          </div>
        </div>
      </section>

      {/* 検索エリア */}
      <section className="search-section" id="search">
        <div className="section-heading">
          <span className="section-en">JOB SEARCH</span>
          <h2>希望条件から求人を探す</h2>
          <p>あなたの希望する働き方や勤務地を選択してください。</p>
        </div>

        <div className="search-box">
          <div className="filter-group">
            <label>雇用形態</label>
            <div className="employment-options">
              {EMPLOYMENT_TYPES.map((type) => (
                <label
                  key={type}
                  className={`employment-option ${
                    employmentTypes.includes(type) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={employmentTypes.includes(type)}
                    onChange={() => toggleEmployment(type)}
                  />
                  <span className="custom-check">
                    {employmentTypes.includes(type) ? "✓" : ""}
                  </span>
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="location-grid">
            <div className="filter-group">
              <label htmlFor="prefecture">都道府県</label>
              <select
                id="prefecture"
                value={prefecture}
                onChange={(e) => handlePrefectureChange(e.target.value)}
              >
                <option value="">全国から探す</option>
                {PREFECTURES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="area">地域・エリア</label>
              <select
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={!prefecture}
              >
                <option value="">
                  {prefecture ? "地域を選択" : "先に都道府県を選択"}
                </option>
                {areas.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group keyword-group">
            <label htmlFor="keyword">キーワード</label>
            <div className="keyword-input">
              <span>⌕</span>
              <input
                id="keyword"
                type="text"
                placeholder="職種・会社名・特徴など"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("jobs")?.scrollIntoView({
                      behavior: "smooth"
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="search-actions">
            <button className="clear-button" onClick={clearFilters}>
              条件をクリア
            </button>
            <button
              className="search-button"
              onClick={() => {
                document.getElementById("jobs")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              <span>⌕</span> この条件で検索する
            </button>
          </div>
        </div>
      </section>

      {/* 求人一覧 */}
      <section className="jobs-section" id="jobs">
        <div className="jobs-heading">
          <div>
            <span className="section-en">RECOMMENDED JOBS</span>
            <h2>おすすめの求人</h2>
          </div>
          <div className="result-count">
            <strong>{filteredJobs.length}</strong> 件の求人
          </div>
        </div>

        <div className="active-filters">
          {employmentTypes.map((type) => (
            <span key={type}>{type}</span>
          ))}
          {prefecture && <span>{prefecture}</span>}
          {area && <span>{area}</span>}
          {keyword && <span>{keyword}</span>}
          {(employmentTypes.length > 0 || prefecture || area || keyword) && (
            <button onClick={clearFilters}>すべて解除 ×</button>
          )}
        </div>

        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-header">
                  <span className={`employment-badge badge-${job.employment}`}>
                    {job.employment}
                  </span>
                  <span className="job-date">掲載日：{job.date}</span>
                </div>

                <div className="job-card-main">
                  <div className="company-name">{job.company}</div>
                  <h3>{job.title}</h3>
                  <p className="job-description">{job.description}</p>
                </div>

                <div className="job-details">
                  <div>
                    <span>勤務地</span>
                    <strong>{job.prefecture} {job.area}</strong>
                  </div>
                  <div>
                    <span>給与</span>
                    <strong className="salary">{job.salary}</strong>
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="job-tags">
                    {job.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button
                    className={`favorite-button ${
                      favorites.includes(job.id) ? "favorited" : ""
                    }`}
                    onClick={() => toggleFavorite(job.id)}
                    aria-label="お気に入り"
                  >
                    {favorites.includes(job.id) ? "♥" : "♡"}
                  </button>
                </div>

                <button className="detail-button">
                  求人の詳細を見る <span>→</span>
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
              <h3>該当する求人がありません</h3>
              <p>検索条件を変更して、もう一度お試しください。</p>
              <button onClick={clearFilters}>検索条件をリセット</button>
            </div>
          )}
        </div>
      </section>

      {/* サービス案内 */}
      <section className="about-section" id="about">
        <span className="section-en">ABOUT WORK NAVI</span>
        <h2>自分らしい働き方を見つけるために。</h2>
        <p>
          雇用形態や勤務地など、希望条件に合わせて求人を検索。
          <br />
          あなたの次のキャリアを見つけるお手伝いをします。
        </p>
      </section>

      <footer className="site-footer">
        <div className="footer-logo">WORK<span>NAVI</span></div>
        <p>© 2026 WORK NAVI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;