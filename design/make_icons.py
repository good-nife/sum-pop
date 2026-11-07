"""生成 App 图标和启动画面。运行：python3 design/make_icons.py
改颜色、数字或布局后重新运行，再 npx cap sync ios 即可。"""
import json
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, '..', 'ios', 'App', 'App', 'Assets.xcassets')
FONT = os.path.join(HERE, 'Baloo2-wght.ttf')

INK = (23, 48, 42)
ORANGE = (255, 198, 92)
BLUE = (140, 203, 255)
YELLOW = (255, 194, 51)
CORAL = (255, 158, 138)


def font(px, weight=800):
    f = ImageFont.truetype(FONT, int(px))
    f.set_variation_by_axes([weight])
    return f


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def tile(size, color, digit):
    """和游戏里一样的数字块：圆角、底部一条深色"厚度"。"""
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(size * 0.28)
    lip = int(size * 0.07)
    d.rounded_rectangle([0, 0, size - 1, size - 1], r, fill=shade(color, 0.84))
    d.rounded_rectangle([0, 0, size - 1, size - 1 - lip], r, fill=color)
    f = font(size * 0.66)
    box = d.textbbox((0, 0), digit, font=f)
    w, h = box[2] - box[0], box[3] - box[1]
    d.text(((size - w) / 2 - box[0], (size - lip - h) / 2 - box[1]), digit, font=f, fill=INK)
    return im


def paste_tile(canvas, t, cx, cy, angle, shadow_alpha):
    rot = t.rotate(angle, resample=Image.BICUBIC, expand=True)
    x, y = int(cx - rot.width / 2), int(cy - rot.height / 2)
    if shadow_alpha:
        pad = int(t.width * 0.2)  # 留出模糊的空间，否则阴影会被切成方块
        a = rot.split()[3].point(lambda v: v * shadow_alpha // 255)
        sh = Image.new('RGBA', (rot.width + 2 * pad, rot.height + 2 * pad), (0, 0, 0, 0))
        mask = Image.new('L', sh.size, 0)
        mask.paste(a, (pad, pad))
        sh.putalpha(mask)
        sh = sh.filter(ImageFilter.GaussianBlur(t.width * 0.05))
        canvas.alpha_composite(sh, (x - pad, y - pad + int(t.width * 0.06)))
    canvas.alpha_composite(rot, (x, y))


def burst(canvas, ox, oy, unit):
    """"砰"的爆开线：向上散开的黄色短线 + 两个小圆点。"""
    d = ImageDraw.Draw(canvas)
    w = int(unit * 0.062)
    for ang in (-150, -120, -90, -60, -30):
        a = math.radians(ang)
        r1, r2 = unit * 0.13, unit * (0.30 if ang == -90 else 0.25)
        p1 = (ox + math.cos(a) * r1, oy + math.sin(a) * r1)
        p2 = (ox + math.cos(a) * r2, oy + math.sin(a) * r2)
        d.line([p1, p2], fill=YELLOW, width=w)
        for p in (p1, p2):
            d.ellipse([p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2], fill=YELLOW)
    for dx, dy, rr, c in ((-0.34, -0.06, 0.03, CORAL), (0.35, -0.10, 0.026, CORAL)):
        x, y = ox + dx * unit, oy + dy * unit
        d.ellipse([x - rr * unit, y - rr * unit, x + rr * unit, y + rr * unit], fill=c)


def mark(canvas, cx, cy, unit, shadow_alpha=110):
    """整个图案：3 和 7 两个块互相靠近，头顶爆开。unit = 图案的参考宽度。"""
    ts = int(unit * 0.40)
    burst(canvas, cx, cy - unit * 0.20, unit)
    paste_tile(canvas, tile(ts, ORANGE, '3'), cx - unit * 0.19, cy + unit * 0.05, 9, shadow_alpha)
    paste_tile(canvas, tile(ts, BLUE, '7'), cx + unit * 0.19, cy + unit * 0.09, -9, shadow_alpha)


def radial_bg(size, inner, outer):
    bg = Image.new('RGBA', (size, size), outer + (255,))
    glow = Image.new('L', (size, size), 0)
    ImageDraw.Draw(glow).ellipse([size * 0.1, size * 0.05, size * 0.9, size * 0.85], fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.18))
    bg.paste(Image.new('RGBA', (size, size), inner + (255,)), (0, 0), glow)
    return bg


def make_icon():
    S = 2048  # 两倍尺寸画，再缩小，边缘更平滑
    im = radial_bg(S, (33, 70, 61), (19, 43, 37))
    mark(im, S / 2, S * 0.56, S * 0.84, shadow_alpha=150)
    im = im.resize((1024, 1024), Image.LANCZOS).convert('RGB')  # 图标不能带透明通道
    out = os.path.join(ASSETS, 'AppIcon.appiconset', 'AppIcon-512@2x.png')
    im.save(out)
    im.save(os.path.join(HERE, 'icon-preview.png'))
    print('icon ->', out)


def make_splash(dark):
    S = 2732
    bg, fg = ((14, 25, 22), (226, 240, 234)) if dark else ((228, 239, 234), INK)
    im = Image.new('RGBA', (S, S), bg + (255,))
    mark(im, S / 2, S * 0.47, 620, shadow_alpha=70 if not dark else 140)
    d = ImageDraw.Draw(im)
    f = font(150)
    box = d.textbbox((0, 0), 'Sum Pop', font=f)
    d.text(((S - (box[2] - box[0])) / 2 - box[0], S * 0.47 + 250), 'Sum Pop', font=f, fill=fg)
    return im.convert('RGB')


def make_splashes():
    folder = os.path.join(ASSETS, 'Splash.imageset')
    for f in os.listdir(folder):
        if f.endswith('.png'):
            os.remove(os.path.join(folder, f))
    make_splash(False).save(os.path.join(folder, 'splash.png'))
    make_splash(True).save(os.path.join(folder, 'splash-dark.png'))
    make_splash(False).resize((900, 900), Image.LANCZOS).save(os.path.join(HERE, 'splash-preview.png'))
    contents = {
        'images': [
            {'idiom': 'universal', 'filename': 'splash.png'},
            {'idiom': 'universal', 'filename': 'splash-dark.png',
             'appearances': [{'appearance': 'luminosity', 'value': 'dark'}]},
        ],
        'info': {'version': 1, 'author': 'xcode'},
    }
    with open(os.path.join(folder, 'Contents.json'), 'w') as fp:
        json.dump(contents, fp, indent=2)
    print('splash ->', folder)


if __name__ == '__main__':
    make_icon()
    make_splashes()
