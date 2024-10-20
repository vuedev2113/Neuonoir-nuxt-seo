import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    safelist: [
        {
            pattern: /bg-+/, // 👈  This includes bg of all colors and shades
        },
        "text-[#a6b6cd]",
        "from-[#162738]",
        "to-[#25415e]",
        "bg-[#a5b5cb]",
        "from-[#031d5f]",
        "to-[#0b2575]",
        "text-[#ae966d]",
        "from-[#1a150f]",
        "to-[#443427]",
        "from-[#273541]",
        "to-[#273541]",
        "from-[#404039]",
        "to-[#404039]",
        "from-[#142129]",
        "to-[#213035]",
        "from-[#65655d]",
        "to-[#65655d]",
        "from-[#300134]",
        "to-[#18021b]",
        "from-[#1d1a18]",
        "to-[#141516]",
        "to-[#282b30]",
        "from-[#555555]",
        "to-[#444444]",
        "rounded-xl",
        "pt-12",
        "w-80",
        "mx-auto",
        "pl-3",
        "p-3"
    ],
    theme: {
        extend: {
            colors: {
                'neurodarkgrey': '#121412',
                'neurodarkgreyvar': '#191b19',
                'neurolight': '#f0f6f0',
                'discord': '#5562ea',
                'neurolink': '#789178',
                'neuroprimary': '#326a32',
                'neurolightgrey': '#aaaaaa',
                transparent: 'transparent',
                current: 'currentColor',
                white: '#ffffff',
                purple: '#3f3cbb',
                midnight: '#121063',
                metal: '#565584',
                tahiti: '#3ab7bf',
                silver: '#ecebff',
                'bubble-gum': '#ff77e9',
                bermuda: '#78dcca',
            }
        }
    }
}