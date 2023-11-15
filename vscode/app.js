// const songs = [
//     {
//         name: 'Dont Côi',
//         singer: 'RPT Orijinn x Ronboogz',
//         path: '.assets/music/Dont_Coi.mp3',
//         image: '.assets/img/DontCoi.png'
//     },
//     {
//         name: 'Lan man',
//         singer: 'Ronboogz',
//         path: './assets/music/Lan_man.mp3',
//         image: './assets/img/LanMan.png'
//     },
//     {
//         name: '2AM',
//         singer: 'JustaTee feat Big Daddy',
//         path: './assets/music/2AM.mp3',
//         image: './assets/img/2AM.png'
//     }
// ]
// 1. Render song
// 2. Scroll to top
// 3. Play/pause/seek
// 4. CD rotate
// 5. Next / prev
// 6. Radndom
// 7. Next / repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')




const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    songs: [
        {
            name: 'Dont Côi',
            singer: 'RPT Orijinn x Ronboogz',
            path: './assets/music/Dont_Coi.mp3',
            image: './assets/img/DontCoi.png'
        },
        {
            name: 'Lan man',
            singer: 'Ronboogz',
            path: './assets/music/Lan_man.mp3',
            image: './assets/img/LanMan.png'
        },
        {
            name: '2AM',
            singer: 'JustaTee feat Big Daddy',
            path: './assets/music/2AM.mp3',
            image: './assets/img/2AM.png'
        }
    ],
   
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('\n');


    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {

        const _this = this; //gán object app vào biến _this để gọi các 
        //properties của app

        //Xử lý xoay CD và dừng
        const cdAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdAnimate.pause();

        //xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollTop || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;

        }

        //Xử lý khi click vào Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

        }

        // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.play();
        }

        //Khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            //nếu bài hát đang được phát
            //đổi biến thành false
            //dừng audio
            //gỡ class playing ra
            cdAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

        }

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        //Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý random bật tắt
        randBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randBtn.classList.toggle('active', _this.isRandom);

        }

        //Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }

        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            //Xử lý khi click vào bài hát
            if (songNode || e.target.closest('.option')) {

                //Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }
                //Xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 200);
    },

    loadCurrentSong: function () {


        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex);

        this.currentIndex = newIndex
        this.loadCurrentSong();
    },



    start: function () {
        //định nghĩa các thuộc tính trong object
        this.defineProperties();

        //lắng nghe/xử lý các sự kiện (DOM events)
        this.handleEvents();

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();


        //render playlist
        this.render();
    }

}

app.start();






