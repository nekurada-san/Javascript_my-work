'use strict';

// ページを読み込んだ後に操作するため$(document).readyを使用
// toggleClassでactiveのクラスを追加
$(document).ready(function () {
  // ハンバーガーメニュー処理
  $('.hamburger-menu').on('click', function () {
    $('#menu').toggleClass('active');
    if ($('#menu').hasClass('active')) {
      $('#close-btn').show();
    } else {
      $('#close-btn').hide();
    }
  });

  // 閉じるボタンを押した際にメニュー非表示
  $('#close-btn').on('click', function (e) {
    e.stopPropagation();  // クリックイベントが親要素に伝播しないようにする
    $('#menu').removeClass('active');
    $(this).hide();  // ×ボタンを即非表示
  });

  // 画面サイズ変更時にメニューを自動的に閉じる
  $(window).on('resize', function () {
    if ($(window).width() > 730) {
      $('#menu').removeClass('active');
      $('#close-btn').hide();
    }
  });

  // メニュー外部をクリックした場合もメニューを閉じる
  $(document).click(function (event) {
    if (!$(event.target).closest('#menu, .hamburger-menu').length) {
      $('#menu').removeClass('active');
      $('#close-btn').hide();
    }
  });

  // メニュー項目アラーム表示
  document.querySelectorAll('.maintenance').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      alert('ただいまメンテナンス中です…');
    });
  });

  document.querySelectorAll('.maintenance2').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      alert('エラー発生。再度読み込み、再起動しても改善されない場合はシステム部にご連絡下さい。');
    });
  });

  document.querySelectorAll('.maintenance3').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      alert('ただいま改装中。coming soon…');
    });
  });

  document.querySelectorAll('.maintenance4').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      alert('こちらはダミーです。');
    });
  });

  document.querySelectorAll('.maintenance5').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      alert('こちらのメニュー項目は全てダミーです。');
    });
  });

  // ✅ カレンダー表示処理
  let currentDate = new Date();

  // 初回カレンダー表示
  renderCalendar(currentDate);

  // 前月ボタン処理
  $('#prev-month').on('click', function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  // 次月ボタン処理
  $('#next-month').on('click', function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // ✅ 日付クリック時の処理
  $(document).on('click', '.calendar td', function () {
    const selectedDay = $(this).text();  // クリックした日付
    if (selectedDay !== '') {
      const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

      // モーダルを表示
      $('#schedule-modal').fadeIn();
      $('#selected-date').text(`${selectedDate}の予定`);

      // 既存の予定があれば表示（今回は例として保存を仮定）
      const existingSchedule = localStorage.getItem(selectedDate);  // localStorageから予定を取得
      if (existingSchedule) {
        $('#schedule').val(existingSchedule);  // 予定内容を表示
      } else {
        $('#schedule').val('');  // 予定がなければ空にする
      }

      // 保存ボタンの処理
      $('#btn').off('click').on('click', function () {
        const name = $('#member').val();
        const department = $('#department').val();
        const schedule = $('#schedule').val();

        // 予定内容をlocalStorageに保存（日付をキーとして）
        localStorage.setItem(selectedDate, schedule);

        // 保存後、モーダルを非表示にする
        $('#schedule-modal').fadeOut();
      });
    }
  });

  // モーダルを閉じる処理
  $('.close').on('click', function () {
    $('#schedule-modal').fadeOut();
  });
});

// ✅ 日本の祝日リスト（グローバルスコープで定義）
const holidays = {
  "2025-01-01": "元日",
  "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日",
  "2025-02-23": "天皇誕生日",
  "2025-03-20": "春分の日",
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日",
  "2025-05-05": "こどもの日",
  "2025-07-21": "海の日",
  "2025-08-11": "山の日",
  "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日",
  "2025-10-13": "スポーツの日",
  "2025-11-03": "文化の日",
  "2025-11-23": "勤労感謝の日"
};

// ✅ ゴールデンウィーク、お盆、年末年始の追加
const specialPeriods = [
  ["2025-04-29", "2025-05-05"], // ゴールデンウィーク
  ["2025-08-10", "2025-08-16"], // お盆
  ["2025-12-29", "2026-01-03"]  // 年末年始
];

// 特定期間の日付を holidays に追加（背景色を祝日と同じにする）
function addSpecialPeriods() {
  Object.entries(specialPeriods).forEach(([label, [start, end]]) => {
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 形式
      holidays[dateStr] = label; // 祝日と同じ扱い
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
}

// ✅ カレンダーを生成する関数（グローバル関数に変更）
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // 年月を表示 → ID指定で他と干渉しない
  $('#current-month').text(`${year}年${month + 1}月`);

  const firstDay = new Date(year, month, 1);  // 月の初日
  const lastDay = new Date(year, month + 1, 0);  // 月の最終日
  const startDay = firstDay.getDay();  // 月初日の曜日
  const daysInMonth = lastDay.getDate();  // 月の日数

  const $tbody = $('#calendar-table tbody');

  // カレンダーをクリア
  $tbody.empty();

  // trタグの生成
  let row = $('<tr>');

  // 月初まで空白セルを生成
  for (let i = 0; i < startDay; i++) {
    row.append('<td></td>');
  }

  // 日付を生成
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // tdタグを生成
    let td = $(`<td>${day}</td>`);

    // 土曜 → 青色
    if (dayOfWeek === 6) {
      td.css('color', 'blue');
    }

    // 日曜と祝日 → 赤色
    if (dayOfWeek === 0 || holidays[dateStr]) {
      td.css('color', 'red');     // 日曜・祝日を赤色
    }

    // 祝日の場合は緑背景にする
    if (holidays[dateStr]) {
      td.css('background-color', '#00ff7f');  // 祝日背景色
      td.attr('title', holidays[dateStr]);    // ツールチップで祝日名を表示
    }

    // 行に日付を追加
    row.append(td);

    // 曜日が7つになった際に新しい行の作成
    if (row.children().length === 7) {
      $tbody.append(row);
      row = $('<tr>');
    }
  }

  // 最終行の空白セルを埋める
  if (row.children().length > 0) {
    while (row.children().length < 7) {
      row.append('<td></td>');
    }
    $tbody.append(row);
  }
}

// ✅ 初期設定
addSpecialPeriods();

// 予定表の編集
const members = {
  sales: ['sample', 'test', 'dammy'],
  dev: ['dammy', 'sample', 'test'],
  hr: ['test', 'dammy', 'sample'],
  se: ['こちらの', '選択は', '全てダミーです']
};

document.getElementById('department').addEventListener('change', function () {
  const dept = this.value;
  const memberSelect = document.getElementById('member');
  memberSelect.innerHTML = ''; // 初期化

  if (members[dept]) {
    members[dept].forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      memberSelect.appendChild(option);
    });
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '部署を選択してください';
    memberSelect.appendChild(option);
  }
});