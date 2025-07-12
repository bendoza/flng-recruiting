/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
      borderWidth: {
          DEFAULT: '1px',
          '0': '0',
          '2': '2px',
          '56': '56px',
          '4': '4px',
          '20': '20px',
          '350': '350px',
          '44': '44px',
          '100': '100px',
          '48': '48px',

      },
      extend: {
          fontFamily: {
              custom: ['Rubik', 'sans-serif'],
              sfmono_r: ['SFMono-Regular', 'sans-serif'],
              sfmono_m: ['SFMono-Medium', 'sans-serif'],
              sfmono_l: ['SFMono-Light', 'sans-serif'],
              cocogoose: ['Cocogoose', 'sans-serif'],
              built: ['built', 'sans-serif'],
              lemon: ['lemon', 'sans-serif'],
              geo: ['geo', 'sans-serif'],
          },
          textShadow: {
              'default': '12px 12px 12px rgba(0, 0, 0, 0.25)',
            },
          spacing: {
              '1/10': '10%',
              '1/9': '11.1%',
              '1/6': '16.7%',
              '3/5': '60%',
              '1/4': '25%',
              '1/5': '20%',
              '11/20': '55%',
              '4/5': '80%',
              '7/10': '70%',
              '2/5': '40%',
              '3/10': '30%'
          },
          keyframes: {
              scrollUp: {
                '0%': { transform: 'translateY(0)', opacity: '1' },
                '100%': { transform: 'translateY(-100%)', opacity: '0' },
              },
            },
            animation: {
              'scroll-up': 'scrollUp 0.5s ease-in-out forwards',
            },
      },
  },
  plugins: [],
}