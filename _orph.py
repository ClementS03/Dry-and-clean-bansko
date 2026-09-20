import io, json

# 1. forWho : 5 elements dans une grille de 4 colonnes laissait un orphelin.
#    Un flex centre s adapte a n importe quel nombre, la derniere rangee
#    se centre au lieu de pendre a gauche.
p = "components/hotels/HotelsForWho.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">',
              '<div className="flex flex-wrap justify-center gap-6">')
s = s.replace('className="reveal flex flex-col items-center gap-3 p-6 card-dark text-center"',
              'className="flex flex-col items-center gap-3 p-6 text-center reveal card-dark w-[calc(50%-0.75rem)] sm:w-44"')
assert "flex-wrap justify-center" in s
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 2. reassurance : 4 elements sur 3 colonnes
p = "components/hotels/HotelsReassurance.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"',
              'className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"')
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 3. facteurs du contrat mensuel : 3 elements sur 2 colonnes
p = "components/hotels/HotelsPricing.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('className="grid sm:grid-cols-2 gap-6"', 'className="grid sm:grid-cols-3 gap-6"')
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 4. La page textile est passee a 5 lignes en perdant les rideaux.
#    On en remet une sixieme, utile et vraie.
SIXTH = {
    "bg": "Тест на плата преди пране, за да няма изненади",
    "en": "Fabric test before we start, so there are no surprises",
    "ru": "Тест ткани до начала работ, чтобы не было сюрпризов",
}
for lang in ["bg", "en", "ru"]:
    p = "content/%s.json" % lang
    d = json.load(io.open(p, encoding="utf-8"))
    inc = d["servicePages"]["upholstery-cleaning"]["includes"]
    if len(inc) % 2:
        inc.append(SIXTH[lang])
    io.open(p, "w", encoding="utf-8", newline="\n").write(
        json.dumps(d, ensure_ascii=False, indent=2) + "\n")

# 5. ForRentals rendait encore ses icones en emoji brut
d = json.load(io.open("content/bg.json", encoding="utf-8"))
print("icones rentals :", [i["icon"] for i in d["rentals"]["items"]])
