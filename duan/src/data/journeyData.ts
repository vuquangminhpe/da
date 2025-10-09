export interface JourneyStop {
  id: number;
  date: string;
  location: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  event: string;
  details: string;
  alias?: string;
  significance: string;
  imageUrl?: string; // URL to historical image
  historicalContext?: string; // Additional historical context
  duration?: number; // Duration in seconds for this stop
  sound?: string; // Path to audio file for this stop
}

export const journeyStops: JourneyStop[] = [
  {
    id: 1,
    date: "05/06/1911",
    location: "Bến Nhà Rồng, Sài Gòn",
    city: "Sài Gòn",
    country: "Việt Nam",
    coordinates: [106.7055, 10.7769],
    event: "Khởi đầu hành trình",
    details:
      'Thanh niên Nguyễn Tất Thành, 21 tuổi, lên tàu Amiral de Latouche-Tréville với tên Văn Ba, làm phụ bếp với mức lương 12 đồng bạc Đông Dương mỗi tháng. Trong tâm trí, Người mang theo khát vọng "đi tìm đường cứu nước". Theo hồi ký, Người nói với bạn bè trước khi đi: "Tôi đi để học phương pháp cứu nước rồi về giải phóng đồng bào".',
    significance: "Bước đầu tiên của hành trình 30 năm tìm đường cứu nước",
    imageUrl:
      "https://img.lsvn.vn/resize/th/upload/2025/06/05/ben-nha-rong-5622a-10193196.jpg", // Bến Nhà Rồng
    historicalContext:
      "Thời điểm này, Việt Nam đã bị Pháp cai trị hơn 50 năm. Các cuộc khởi nghĩa yêu nước trước đó như Cần Vương, Đông Du đều thất bại. Thanh niên Nguyễn Tất Thành quyết tâm tìm con đường mới.",
    duration: 15, // Thời gian dừng tại điểm này (giây)
    sound: "/src/assets/file_sound/1.mp3", // Đường dẫn file âm thanh
  },
  {
    id: 2,
    date: "Tháng 6/1911",
    location: "Singapore",
    city: "Singapore",
    country: "Singapore",
    coordinates: [103.8198, 1.3521],
    event: "Điểm dừng đầu tiên ở châu Á",
    details:
      "Tàu dừng chân 3 ngày tại Singapore. Đây là lần đầu tiên Người được tận mắt chứng kiến một thương cảng quốc tế phát triển dưới sự cai trị thuộc địa của Anh. Người quan sát thấy sự đối lập rõ rệt: những tòa nhà cao tầng hiện đại bên cạnh khu ổ chuột nghèo khổ của người dân bản địa. Người Ấn Độ, người Mã Lai, người Hoa đều phải chịu sự phân biệt chủng tộc nghiêm ngặt.",
    significance: "Quan sát xã hội thuộc địa phương Đông",
    imageUrl:
      "https://hcmussh.edu.vn/img/news/24qKxm1lTiOU8LD1GACulAm-.jpeg", // Singapore skyline vintage
    historicalContext:
      "Singapore vào đầu thế kỷ 20 là trung tâm thương mại lớn nhất Đông Nam Á dưới quyền cai trị của Đế quốc Anh, nơi hội tụ nhiều dân tộc nhưng đều chịu áp bức của chủ nghĩa thực dân.",
    duration: 15,
    sound: "/src/assets/file_sound/2.mp3", 
  },
  {
    id: 3,
    date: "Tháng 6/1911",
    location: "Colombo",
    city: "Colombo",
    country: "Sri Lanka",
    coordinates: [79.8612, 6.9271],
    event: "Qua Ceylon (Sri Lanka)",
    details:
      "Tại Colombo, Người có dịp tiếp xúc với công nhân cảng và lao động người Ceylon. Họ kể cho Người nghe về phong trào đấu tranh giành độc lập đang nhen nhóm dưới sự lãnh đạo của các nhà lãnh đạo dân tộc như Dharmapala. Người thấy rằng không chỉ riêng Việt Nam, mà nhiều dân tộc châu Á đang bị đô hộ đều khát khao độc lập tự do. Điều này càng củng cố niềm tin rằng con đường giải phóng dân tộc là vấn đề chung của toàn nhân loại.",
    significance: "Tìm hiểu về phong trào độc lập ở Nam Á",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Environs_de_Saigon_-_Tuduc_-_Maison_commune.jpg/960px-Environs_de_Saigon_-_Tuduc_-_Maison_commune.jpg", // Colombo harbor
    historicalContext:
      "Ceylon (nay là Sri Lanka) đã bị Anh cai trị từ 1815. Phong trào dân tộc chủ nghĩa Ceylon đang lớn mạnh với yêu cầu tự trị.",
    duration: 17,
    sound: "/src/assets/file_sound/3.mp3",
  },
  {
    id: 4,
    date: "Tháng 7/1911",
    location: "Djibouti",
    city: "Djibouti",
    country: "Djibouti",
    coordinates: [43.1456, 11.8251],
    event: "Qua Đông Phi",
    details:
      "Qua Djibouti, cửa ngõ biển Đỏ, Người chứng kiến cảnh tượng đau lòng của người châu Phi dưới ách thống trị của thực dân Pháp. Những người lao động da đen phải làm việc trong điều kiện khắc nghiệt dưới ánh nắng gay gắt của sa mạc, vác gánh nặng từ bến cảng lên kho. Tiền công bèo bọt không đủ nuôi sống gia đình. Cảnh tượng này khắc sâu trong tâm trí Người về bản chất tàn bạo của chủ nghĩa thực dân - không phân biệt lục địa hay màu da, chúng đều bóc lột người lao động một cách dã man.",
    significance: "Chứng kiến chế độ thực dân ở châu Phi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Jetty_of_the_Port_of_Djibouti.jpg", // Djibouti port
    historicalContext:
      "Djibouti là thuộc địa của Pháp từ 1883, là cảng chiến lược quan trọng nối liền châu Âu với châu Á qua kênh Suez và biển Đỏ.",
    duration: 18,
    sound: "/src/assets/file_sound/4.mp3",
  },
  {
    id: 5,
    date: "Tháng 7/1911",
    location: "Port Said",
    city: "Port Said",
    country: "Ai Cập",
    coordinates: [32.3019, 31.2653],
    event: "Qua kênh Suez",
    details:
      "Kênh đào Suez - công trình kỳ vĩ nối liền Địa Trung Hải với biển Đỏ, rút ngắn hành trình từ châu Âu đến châu Á hàng nghìn hải lý. Người quan sát thấy hàng trăm con tàu lớn nhỏ từ khắp nơi trên thế giới cập cảng. Nhưng Người cũng nhận ra rằng công trình này, tuy tuyệt vời, nhưng lại phục vụ cho lợi ích của các nước đế quốc phương Tây. Người Ai Cập xây dựng nên kênh đào bằng máu và mồ hôi của mình, nhưng lợi nhuận lại về tay người Anh và Pháp.",
    significance: "Quan sát công trình kiến trúc hiện đại",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/SuezCanalKantara.jpg", // Suez Canal
    historicalContext:
      "Kênh Suez mở cửa năm 1869, là huyết mạch thương mại giữa Đông và Tây, được kiểm soát bởi Anh và Pháp.",
    duration: 17,
    sound: "/src/assets/file_sound/5.mp3",
  },
  {
    id: 6,
    date: "15/07/1911",
    location: "Marseille",
    city: "Marseille",
    country: "Pháp",
    coordinates: [5.3698, 43.2965],
    event: "Đặt chân lên đất Pháp lần đầu",
    details:
      'Sau 40 ngày vượt biển, tàu cập cảng Marseille, cảng biển lớn nhất nước Pháp bên bờ Địa Trung Hải. Đây là lần đầu tiên Người đặt chân lên đất nước "tông chủ" - đất nước của những kẻ thống trị Việt Nam. Tại đây, Người bắt đầu quan sát xã hội Pháp từ bên trong: xem những công nhân Pháp làm việc như thế nào, họ sống ra sao, họ có hạnh phúc không. Người muốn hiểu tại sao một dân tộc có nền văn minh cao như thế lại đi áp bức các dân tộc khác.',
    significance: "Bắt đầu tìm hiểu về nước Pháp từ bên trong",
    imageUrl:
      "https://www.ugvf.org/wp-content/uploads/2021/11/image-12-768x1023.png", // Marseille port
    historicalContext:
      "Marseille là cửa ngõ của đế quốc thực dân Pháp, nơi hàng hóa và con người từ các thuộc địa về tập trung.",
    duration: 18,
    sound: "/src/assets/file_sound/6.mp3",
  },
  {
    id: 7,
    date: "1912-1917",
    location: "London",
    city: "London",
    country: "Anh",
    coordinates: [-0.1276, 51.5074],
    event: "Làm việc tại Anh 5 năm",
    details:
      "Trong 5 năm tại London - trung tâm của đế quốc Anh hùng mạnh nhất thế giới lúc bấy giờ, Người làm việc tại khách sạn Drayton Court ở West Ealing (1912-1913) và Carlton Hotel ở Westminster (1913-1917). Người học tiếng Anh chăm chỉ, đọc sách báo, tham gia các cuộc họp của công nhân và sinh viên tiến bộ. Người gia nhập Hội người hải ngoại thuộc địa (Overseas Workers Association) và bắt đầu viết những bài báo đầu tiên về tình cảnh người Việt Nam dưới ách thực dân.",
    significance: "Tìm hiểu về xã hội tư bản phát triển nhất thời bấy giờ",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Watson_House_de_fabriek_van_de_Gas_Light_%26_Coke_Company_in_Londen_Onderricht_a%2C_Bestanddeelnr_189-0083.jpg/1280px-Watson_House_de_fabriek_van_de_Gas_Light_%26_Coke_Company_in_Londen_Onderricht_a%2C_Bestanddeelnr_189-0083.jpg", // London Big Ben
    historicalContext:
      "London đầu thế kỷ 20 là trung tâm tài chính và chính trị của đế quốc Anh, cũng là nơi quy tụ nhiều tổ chức chính trị tiến bộ và phong trào công nhân.",
    duration: 20,
    sound: "/src/assets/file_sound/7.mp3",
  },
  {
    id: 8,
    date: "Tháng 12/1912-1913",
    location: "New York",
    city: "New York",
    country: "Hoa Kỳ",
    coordinates: [-74.006, 40.7128],
    event: "Đến Hoa Kỳ, làm việc tại Harlem",
    details:
      'Người đến New York vào mùa đông năm 1912. Làm việc tại khu Harlem - trung tâm văn hóa của cộng đồng người Mỹ gốc Phi. Tại đây, Người chứng kiến hai mặt của nước Mỹ: một bên là nền dân chủ tự do được tuyên truyền rầm rộ, một bên là sự phân biệt chủng tộc tàn khốc đối với người da đen. Người xem các luật Jim Crow, chứng kiến sự bất công về giáo dục, y tế, việc làm. Người tham gia các cuộc biểu tình đòi quyền công dân cho người da đen và học hỏi kinh nghiệm đấu tranh của họ. Người nhận ra rằng ngay cả ở "đất nước tự do", sự áp bức vẫn tồn tại.',
    significance: "Quan sát nền dân chủ Mỹ và vấn đề phân biệt chủng tộc",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Strike_2990272474_524b6f4c0d_o.jpg/1280px-Strike_2990272474_524b6f4c0d_o.jpg", // New York vintage
    historicalContext:
      "Đầu thế kỷ 20, phong trào đấu tranh giành quyền dân sự của người Mỹ gốc Phi đang lớn mạnh, chống lại các luật phân biệt chủng tộc Jim Crow.",
    duration: 23,
    sound: "/src/assets/file_sound/8.mp3",
  },
  {
    id: 9,
    date: "1912-1913",
    location: "Boston",
    city: "Boston",
    country: "Hoa Kỳ",
    coordinates: [-71.0589, 42.3601],
    event: "Làm thợ bánh tại Boston",
    details:
      "Tại khách sạn Parker House nổi tiếng ở Boston, Người làm thợ bánh. Đây là khách sạn lâu đời và sang trọng, phục vụ tầng lớp thượng lưu. Trong khi làm việc, Người quan sát cuộc sống của giới quý tộc và tư sản giàu có, so sánh với cảnh nghèo khó của công nhân nhà bếp. Người thấy rõ sự bất bình đẳng sâu sắc trong xã hội tư bản. Người cũng tìm đến thư viện công cộng Boston - một trong những thư viện lớn nhất Mỹ - để đọc sách về lịch sử cách mạng, về các tư tưởng tiến bộ.",
    significance: "Trải nghiệm cuộc sống công nhân Mỹ",
    imageUrl:
      "https://ordi.vn/wp-content/uploads/2024/05/Boston-1-1024x768-768x576.png", // Boston
    historicalContext:
      "Boston là một trong những trung tâm văn hóa và giáo dục lớn nhất nước Mỹ, nơi có truyền thống cách mạng từ thời độc lập.",
    duration: 19,
    sound: "/src/assets/file_sound/9.mp3",
  },
  {
    id: 10,
    date: "1917-1923",
    location: "Paris",
    city: "Paris",
    country: "Pháp",
    coordinates: [2.3522, 48.8566],
    event: "Hoạt động cách mạng tại Pháp",
    details:
      'Định cư tại Paris, Người thuê nhà ở 9 phố Impasse Compoint (quận 17). Người tham gia thành lập "Nhóm Người Việt Yêu Nước" (1919), tham gia viết cho báo Le Paria (Người cùng khổ), La Vie Ouvrière (Đời sống công nhân). Người đổi tên thành Nguyễn Ái Quốc. Tại Paris, Người gặp gỡ nhiều nhà hoạt động chính trị tiến bộ, tham gia các buổi biểu tình đòi quyền cho người lao động. Người sống giản dị, dành hết thời gian cho hoạt động cách mạng.',
    alias: "Nguyễn Ái Quốc",
    significance: "Giai đoạn hình thành tư tưởng cách mạng ban đầu",
    imageUrl:
      "https://baotanglichsu.vn/DataFiles/Uploaded/image/data%20Hung/nguyen%20ai%20quoc/3.jpg", // Paris
    historicalContext:
      "Paris sau Thế chiến I là trung tâm của các phong trào chính trị tiến bộ, nơi tụ họp nhiều nhà cách mạng từ khắp thế giới.",
    duration: 20,
    sound: "/src/assets/file_sound/10.mp3",
  },
  {
    id: 11,
    date: "18/06/1919",
    location: "Versailles",
    city: "Versailles",
    country: "Pháp",
    coordinates: [2.1301, 48.8014],
    event: "Gửi Bản yêu sách 8 điểm lịch sử",
    details:
      'Ngày 18/6/1919, Người gửi "Bản yêu sách 8 điểm của nhân dân An Nam" đến Hội nghị Versailles (Vécxây) - nơi các cường quốc chiến thắng Thế chiến I đang thảo luận về trật tự thế giới mới. Bản yêu sách đòi: 1) Ân xá cho tù chính trị; 2) Cải cách chế độ tư pháp; 3) Tự do báo chí, tự do hội họp; 4) Quyền cư trú tự do; 5) Quyền học hành; 6) Quyền tự do di chuyển ra nước ngoài; 7) Đại diện trong Nghị viện Pháp; 8) Thay chế độ sắc lệnh bằng luật pháp. Tuy không được chấp nhận, văn kiện này đã làm chấn động dư luận thế giới. Từ đây, tên tuổi Nguyễn Ái Quốc được biết đến rộng rãi.',
    alias: "Nguyễn Ái Quốc",
    significance:
      "Lần đầu tiên tiếng nói Việt Nam vang lên trên đấu trường quốc tế",
    imageUrl:
      "https://llct.1cdn.vn/2020/03/17/lyluanchinhtri.vn-home-media-k2-items-cache-_a4b386613794e4c7cd10e5b37246fd64_l.jpg", // Versailles palace
    historicalContext:
      "Hội nghị Versailles (1919) quyết định trật tự thế giới sau chiến tranh, nhưng vấn đề thuộc địa không được đề cập đúng mức.",
    duration: 27,
    sound: "/src/assets/file_sound/11.mp3",
  },
  {
    id: 12,
    date: "25-30/12/1920",
    location: "Tours",
    city: "Tours",
    country: "Pháp",
    coordinates: [0.6833, 47.3941],
    event: "Tham gia sáng lập Đảng Cộng sản Pháp",
    details:
      'Tại Đại hội XVIII Đảng Xã hội Pháp ở Tours (25-30/12/1920), sau nhiều ngày đọc "Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và thuộc địa" của Lênin, Người đã tìm thấy câu trả lời cho câu hỏi "Đường nào để cứu nước?". Trong phiên bỏ phiếu lịch sử, Người đứng về phe tán thành gia nhập Quốc tế Cộng sản (Quốc tế III). Người kể lại: "Tôi tin tưởng tuyệt đối vào Quốc tế III, vào Cách mạng Tháng Mười, vào Lênin vì những luận cương của ông về vấn đề dân tộc và thuộc địa". Đây là bước ngoặt quan trọng nhất trong tư tưởng của Người.',
    alias: "Nguyễn Ái Quốc",
    significance: "Tìm thấy con đường cứu nước: Chủ nghĩa Mác-Lênin",
    imageUrl:
      "https://bqllang.gov.vn/images/Thang_11.2013/19.11.2013/_nh_BH___-H_tours.gif", // Tours city
    historicalContext:
      "Đại hội Tours đánh dấu sự phân chia trong phong trào cộng sản quốc tế. Đa số đại biểu tán thành gia nhập Quốc tế III và thành lập Đảng Cộng sản Pháp.",
    duration: 22,
    sound: "/src/assets/file_sound/12.mp3",
  },
  {
    id: 13,
    date: "Tháng 6/1923-1924",
    location: "Moskva",
    city: "Moskva",
    country: "Liên Xô",
    coordinates: [37.6173, 55.7558],
    event: "Học tập tại Liên Xô lần thứ nhất",
    details:
      "Tháng 6/1923, Người đến Moskva tham dự Đại hội V Quốc tế Cộng sản với tư cách đại biểu Đảng Cộng sản Pháp. Sau đó Người ở lại học tập tại Trường Đại học Phương Đông (Đại học Lao động phương Đông - KUTV) trong 14 tháng. Tại đây, Người nghiên cứu sâu về lý luận Mác-Lênin, học tiếng Nga, gặp gỡ các nhà cách mạng từ nhiều nước. Người tham gia viết nhiều bài báo về tình hình Đông Dương cho các tạp chí của Quốc tế Cộng sản. Đây là giai đoạn Người nâng cao trình độ lý luận một cách có hệ thống.",
    alias: "Nguyễn Ái Quốc",
    significance: "Nâng cao trình độ lý luận cách mạng",
    imageUrl:
      "https://hochiminh.vn/Uploads/2019/1/2/17/BH.310_resize.jpg", // Moscow Red Square
    historicalContext:
      "Liên Xô những năm 1920 là trung tâm của phong trào cộng sản thế giới, thu hút các nhà cách mạng từ khắp nơi đến học tập.",
    duration: 21,
    sound: "/src/assets/file_sound/13.mp3",
  },
  {
    id: 14,
    date: "11/1924-1927",
    location: "Quảng Châu",
    city: "Quảng Châu (Guangzhou)",
    country: "Trung Quốc",
    coordinates: [113.2644, 23.1291],
    event: "Thành lập Hội Việt Nam Cách mạng Thanh niên",
    details:
      'Tháng 11/1924, Người đến Quảng Châu với tên Lý Thụy. Ngày 11/6/1925, Người thành lập Hội Việt Nam Cách mạng Thanh niên - tổ chức cách mạng đầu tiên của Việt Nam có cương lĩnh rõ ràng. Người mở các lớp huấn luyện chính trị, giảng dạy về chủ nghĩa Mác-Lênin, về chiến lược chiến thuật cách mạng. Người viết cuốn "Đường Cách Mệnh" (1927) - giáo trình cách mạng đầu tiên bằng tiếng Việt, trong đó nêu rõ: "Muốn làm cách mạng thì phải có một đảng cách mạng". Trong 3 năm, Người đào tạo được hơn 250 cán bộ cách mạng, họ về nước trở thành xương sống của phong trào cách mạng Việt Nam.',
    alias: "Lý Thụy",
    significance: "Đào tạo thế hệ cách mạng đầu tiên của Việt Nam",
    imageUrl:
      "https://hochiminh.vn/Uploads/2019/1/2/17/BH.760_resize.jpg", // Guangzhou
    historicalContext:
      "Quảng Châu 1924-1927 là trung tâm hợp tác Quốc-Cộng ở Trung Quốc, thu hút nhiều nhà cách mạng châu Á.",
    duration: 25,
    sound: "/src/assets/file_sound/14.mp3",
  },
  {
    id: 15,
    date: "1927-1928",
    location: "Nakhon Phanom",
    city: "Nakhon Phanom",
    country: "Thái Lan",
    coordinates: [104.782, 17.4091],
    event: "Hoạt động cách mạng tại Đông Bắc Thái Lan",
    details:
      "Sau cuộc đảo chính của Tưởng Giới Thạch (4/1927) thảm sát cộng sản ở Trung Quốc, Người phải rời Quảng Châu. Người sang Thái Lan, sinh sống tại Nakhon Phanom - vùng biên giới gần Việt Nam, nơi có cộng đồng người Việt sinh sống. Với tên gọi Thầu Chín, Người làm thầy thuốc đông y, vừa chữa bệnh cho dân vừa tuyên truyền cách mạng. Người xây dựng mạng lưới liên lạc với các đồng chí trong nước, chuẩn bị cho việc thành lập Đảng.",
    alias: "Thầu Chín",
    significance: "Mở rộng mạng lưới cách mạng ra khu vực",
    imageUrl: "https://image.giacngo.vn/w770/Uploaded/2025/estnselxslt/2024_09_01/14a-8402.jpg",
    historicalContext:
      "Đông Bắc Thái Lan có cộng đồng người Việt đông đảo, là địa điểm thuận lợi cho hoạt động bí mật.",
    duration: 18,
    sound: "/src/assets/file_sound/15.mp3",
  },
  {
    id: 16,
    date: "1929-1931",
    location: "Hong Kong",
    city: "Hong Kong",
    country: "Trung Quốc",
    coordinates: [114.1694, 22.3193],
    event: "Thành lập Đảng Cộng sản Việt Nam",
    details:
      "Ngày 3/2/1930, tại Hội trường Nhà hát ở Cửu Long (Kowloon), Hong Kong, Người chủ trì Hội nghị hợp nhất ba tổ chức cộng sản (Đông Dương Cộng sản Đảng ở Bắc Kỳ, An Nam Cộng sản Đảng ở Trung Kỳ, Đông Dương Cộng sản Liên đoàn ở Nam Kỳ) thành Đảng Cộng sản Việt Nam. Người soạn thảo Chính cương vắn tắt và Sách lược vắn tắt - hai văn kiện quan trọng nhất của Đảng non trẻ. Tháng 6/1931, Người bị mật thám Pháp bắt và giam tại nhà tù Hong Kong đến năm 1933.",
    alias: "Nguyễn Ái Quốc",
    significance: "Sự kiện lịch sử vĩ đại - Ra đời Đảng Cộng sản Việt Nam",
    imageUrl:
      "https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c8078538b253fda71f099c6cfd37729a9151786f9e25f398caf3266dc7c9259ae2ac064f9efb0c8972265f49d8f86164867992/0406_hong_kong.jpg", // Hong Kong vintage
    historicalContext:
      "Việt Nam cần một đảng cách mạng chân chính để lãnh đạo phong trào giải phóng dân tộc. Sự ra đời của Đảng là tất yếu khách quan.",
    duration: 20,
    sound: "/src/assets/file_sound/16.mp3",
  },
  {
    id: 17,
    date: "1933",
    location: "Shanghai",
    city: "Thượng Hải",
    country: "Trung Quốc",
    coordinates: [121.4737, 31.2304],
    event: "Trốn sang Thượng Hải",
    details:
      "Nhờ luật sư Anh tiến bộ Frank Loseby bào chữa, Người được thả khỏi nhà tù Hong Kong. Để thoát khỏi sự truy lùng của mật thám Pháp, Người giả tin đồn về cái chết của mình, sau đó bí mật sang Thượng Hải. Tại đây, Người tiếp tục hoạt động bí mật, liên lạc với Quốc tế Cộng sản, chuẩn bị cho chặng đường tiếp theo.",
    significance: "Thoát khỏi sự truy lùng của thực dân Pháp",
    imageUrl: "https://hochiminh.vn/Uploads/2019/1/2/17/BH.416_resize.jpg",
    historicalContext:
      "Thượng Hải thập niên 1930 là thành phố phức tạp với nhiều thế lực, thuận lợi cho hoạt động bí mật.",
    duration: 13,
    sound: "/src/assets/file_sound/17.mp3",
  },
  {
    id: 18,
    date: "1934-1938",
    location: "Moskva",
    city: "Moskva",
    country: "Liên Xô",
    coordinates: [37.6173, 55.7558],
    event: "Trở lại Liên Xô lần thứ hai",
    details:
      "Người trở lại Moskva, làm việc tại Quốc tế Cộng sản, theo dõi sát tình hình Đông Dương và thế giới. Người viết nhiều bài báo phân tích về chiến lược chống phát xít, về vấn đề dân tộc thuộc địa. Giai đoạn này, Người hoàn thiện tư tưởng về cách mạng Việt Nam, chuẩn bị cho giai đoạn mới khi chiến tranh thế giới sắp bùng nổ.",
    alias: "Lin / Linov",
    significance: "Hoàn thiện tư tưởng và đường lối cách mạng Việt Nam",
    imageUrl: "https://cdn.giaoduc.net.vn/images/4567b617dad583be1e7afcde73e8465c10505e7ac00f72305556498cfcf3e8292985024b18d197e0d0bb2563de3bb9bd484a12abfa79a66dd59d31f9ee6f78bc/thu_do_moscow_nga_1.jpg",
    historicalContext:
      "Thập niên 1930, nguy cơ chiến tranh thế giới lần 2 đang đến gần. Phong trào cộng sản thế giới chuẩn bị đối đầu với phát xít.",
    duration: 13,
    sound: "/src/assets/file_sound/18.mp3",
  },
  {
    id: 19,
    date: "1938-1940",
    location: "Diên An",
    city: "Yan'an",
    country: "Trung Quốc",
    coordinates: [109.4903, 36.5854],
    event: "Cố vấn chính trị và chuẩn bị trở về",
    details:
      "Tại căn cứ địa Diên An của Đảng Cộng sản Trung Quốc, Người làm cố vấn cho mặt trận chống Nhật. Người theo dõi sát diễn biến chiến tranh thế giới, phân tích tình hình Đông Dương. Khi Pháp đầu hàng Đức (1940), Nhật chiếm Đông Dương, Người nhận định đây là thời cơ của cách mạng Việt Nam. Người bắt đầu chuẩn bị kế hoạch trở về Tổ quốc.",
    significance: "Chuẩn bị cho cuộc cách mạng giải phóng dân tộc",
    imageUrl:
      "https://cand.com.vn/Files/Image/linhchi/2017/06/13/ca17579b-a395-436e-a08c-03ef6bc4b12e.jpg",
    historicalContext:
      "Chiến tranh thế giới lần 2 bùng nổ, tạo điều kiện cho các phong trào giải phóng dân tộc ở châu Á.",
    duration: 14,
    sound: "/src/assets/file_sound/19.mp3",
  },
  {
    id: 20,
    date: "28/01/1941",
    location: "Pác Bó, Cao Bằng",
    city: "Cao Bằng",
    country: "Việt Nam",
    coordinates: [106.2522, 22.6657],
    event: "Trở về Tổ quốc sau 30 năm",
    details:
      "Sau đúng 30 năm, ngày 28/1/1941, Người đặt chân trở lại đất nước tại hang Pác Bó, Cao Bằng. Người đổi tên thành Hồ Chí Minh. Tại Pác Bó, Người trực tiếp lãnh đạo cách mạng: triệu tập Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng (5/1941), thành lập Việt Minh (19/5/1941). Người viết nhiều bài thơ, bài báo cổ vũ cách mạng. Kết thúc 30 năm tìm đường, Người bắt đầu chặng đường lãnh đạo nhân dân giành độc lập, dẫn đến Cách mạng Tháng Tám 1945 thành công.",
    alias: "Hồ Chí Minh",
    significance:
      "Kết thúc hành trình tìm đường, bắt đầu trực tiếp lãnh đạo cách mạng",
    imageUrl:
      "https://tuyengiaocaobang.vn/uploads/news/2024_01/image-20240126143953-1.png",
    historicalContext:
      "1941, Nhật-Pháp thống trị song song ở Đông Dương. Nhân dân Việt Nam chịu đựng 'hai tầng áp bức'. Thời cơ cách mạng đã chín muồi.",
    duration: 24,
    sound: "/src/assets/file_sound/20.mp3",
  },
];

// Group by regions for better storytelling
export const journeyPhases = [
  {
    phase: "Giai đoạn 1: Khởi hành và tìm hiểu (1911-1917)",
    description: "Rời Tổ quốc, đi qua nhiều nước để tìm hiểu về thế giới",
    stops: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    color: "#dc2626", // red-600
  },
  {
    phase: "Giai đoạn 2: Hình thành tư tưởng (1917-1923)",
    description: "Hoạt động chính trị, tìm thấy con đường cứu nước",
    stops: [10, 11, 12, 13],
    color: "#ea580c", // orange-600
  },
  {
    phase: "Giai đoạn 3: Tổ chức và xây dựng (1924-1930)",
    description: "Đào tạo cán bộ và thành lập Đảng",
    stops: [14, 15, 16],
    color: "#ca8a04", // yellow-600
  },
  {
    phase: "Giai đoạn 4: Hoàn thiện và chuẩn bị (1933-1941)",
    description: "Hoàn thiện đường lối và trở về Tổ quốc",
    stops: [17, 18, 19, 20],
    color: "#16a34a", // green-600
  },
];
