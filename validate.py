"""Validate the Paremia proverbs corpus.

Stdlib only. Runs self-checks against proverbs.json and prints counts.
Usage: python3 validate.py proverbs.json
"""

import json
import sys

META_REQUIRED = ["version", "license", "generated", "curator", "languages", "note"]
CONCEPT_REQUIRED = [
    "id", "title", "gloss", "themes", "keywords",
    "first_attested", "attestation_source", "proverbs",
]
PROVERB_REQUIRED = [
    "id", "lang", "region", "original", "transliteration",
    "literal_en", "meaning_en", "notes",
]


def load(path):
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def fail(msg):
    print("FAIL: " + msg, file=sys.stderr)
    sys.exit(1)


def validate(path):
    data = load(path)

    if not isinstance(data, dict):
        fail("top-level must be an object")

    meta = data.get("meta")
    if not isinstance(meta, dict):
        fail("meta missing or not an object")
    for key in META_REQUIRED:
        if key not in meta:
            fail("meta missing key: " + key)

    concepts = data.get("concepts")
    if not isinstance(concepts, list):
        fail("concepts missing or not a list")

    concept_ids = set()
    total_proverbs = 0
    seen_proverb_ids = set()

    for concept in concepts:
        if not isinstance(concept, dict):
            fail("concept entry not an object")
        for key in CONCEPT_REQUIRED:
            if key not in concept:
                fail("concept missing key: " + key)
        cid = concept["id"]
        if cid in concept_ids:
            fail("duplicate concept id: " + cid)
        concept_ids.add(cid)

        att = concept.get("attestation_source")
        if not att or not isinstance(att, str):
            fail("concept " + cid + " missing attestation_source")

        proverbs = concept["proverbs"]
        if not isinstance(proverbs, list):
            fail("concept " + cid + " proverbs not a list")

        for proverb in proverbs:
            if not isinstance(proverb, dict):
                fail("proverb entry not an object")
            for key in PROVERB_REQUIRED:
                if key not in proverb:
                    if key == "transliteration" and proverb.get(key) is None:
                        proverb[key] = ""
                    else:
                        fail("proverb missing key: " + key)
            pid = proverb["id"]
            if pid in seen_proverb_ids:
                fail("duplicate proverb id: " + pid)
            seen_proverb_ids.add(pid)
            total_proverbs += 1
            if not proverb.get("notes"):
                fail("proverb " + pid + " missing notes")

    languages = meta.get("languages")
    if not isinstance(languages, list) or len(languages) == 0:
        fail("meta.languages must be a non-empty list")

    print("Paremia corpus v" + meta.get("version", "?"))
    print("Version:      " + str(meta.get("version")))
    print("License:      " + str(meta.get("license")))
    print("Generated:    " + str(meta.get("generated")))
    print("Curator:      " + str(meta.get("curator")))
    print("Languages:    " + str(len(languages)))
    print("Concepts:     " + str(len(concepts)))
    print("Proverbs:     " + str(total_proverbs))

    # Self-check asserts
    assert len(concepts) == 67, "expected 67 concepts"
    assert total_proverbs == 683, "expected 683 proverbs"
    assert len(languages) == 29, "expected 29 languages"
    assert meta.get("version") == "0.2.0", "expected version 0.2.0"
    print("Self-checks passed: 683 proverbs, 67 concepts, 29 languages")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "proverbs.json"
    validate(target)
