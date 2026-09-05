# The invent-nothing test — twenty sources re-fetched by the executor

Blueprint §10: *"The reviewer draws at least twenty Source records at random and re-fetches
them; any figure not on its page is a release blocker; any record with a number and no source
is a release blocker."*

**Result: 20 of 20 confirmed. Zero figures were absent from their pages.**

Method: the 146 source ids were sorted and every 7.3rd taken, so the sample spans the whole
pool and is reproducible rather than cherry-picked (`records/refetch-sample.json` holds the
draw). Each was re-fetched by the executor personally, not by an agent. Five are PDFs the
fetch tool returns as binary; those were read directly with `pypdf` (one needed AES
decryption) and matched against the recorded excerpt with whitespace and dash normalisation.

### 1. `src-aarp-grandparents-average-age` — **CONFIRMED**
- AARP Research
- https://www.aarp.org/content/dam/aarp/research/surveys_statistics/life-leisure/2019/aarp-grandparenting-study.doi.10.26419-2Fres.00289.001.pdf
- recorded excerpt: “The youngest grandparents are about 38 years of age, with the average age at first grandchild being 50 (an increase of two years since 2011).”
- PDF (AES-encrypted; read with pypdf + cryptography). Text present verbatim: "The youngest grandparents are about 38 years of age, with the average age at first grandchild being 50 (an increase of two years since 2011)." The raw extraction renders "two yearssince" — a line-break artifact of PDF text extraction, not a difference in the source.

### 2. `src-bls-attainment-reported-from-age-twenty-five` — **CONFIRMED**
- U.S. Bureau of Labor Statistics
- https://www.bls.gov/cps/demographics/educational-attainment.htm
- recorded excerpt: “Educational attainment data published by BLS typically pertain to people age 25 and older because most people have completed their schooling by age 25.”
- Re-fetched. Sentence found in the "Understanding these data" section, word for word.

### 3. `src-bls-lfp-oldest-band` — **CONFIRMED**
- U.S. Bureau of Labor Statistics
- https://www.bls.gov/opub/ted/2021/number-of-people-75-and-older-in-the-labor-force-is-expected-to-grow-96-5-percent-by-2030.htm
- recorded excerpt: “The only age group whose labor force participation rate is projected to rise are people age 75 and older”
- Re-fetched. "The only age group whose labor force participation rate is projected to rise are people age 75 and older, from 8.9 percent in 2020 to 11.7 percent by 2030."

### 4. `src-bls-wkyeng-2025q2-youngest` — **CONFIRMED**
- U.S. Bureau of Labor Statistics
- https://www.bls.gov/news.release/archives/wkyeng_07222025.htm
- recorded excerpt: “Men and women ages 16 to 24 had the lowest median weekly earnings, $797 and $712, respectively.”
- Re-fetched. "Men and women ages 16 to 24 had the lowest median weekly earnings, $797 and $712, respectively."

### 5. `src-census-ad1-young-adults-living-at-home` — **CONFIRMED**
- U.S. Census Bureau
- https://www.census.gov/data/tables/time-series/demo/families/adults.html
- recorded excerpt: “Table AD-1. Young Adults, 18-34 Years Old, Living At Home: 1960 to Present”
- Re-fetched. Table title verbatim: "Table AD-1. Young Adults, 18-34 Years Old, Living At Home: 1960 to Present".

### 6. `src-census-living-arrangements-across-age-groups` — **CONFIRMED**
- U.S. Census Bureau
- https://www.census.gov/library/stories/2024/05/living-arrangements.html
- recorded excerpt: “The most common living arrangement among 18- to 24-year-olds in 2022 was living in a parent's home (Figure 1).”
- Re-fetched. Sentence present, with the following sentence confirming the reading.

### 7. `src-cfpb-claiming-age` — **CONFIRMED**
- Consumer Financial Protection Bureau
- https://www.consumerfinance.gov/consumer-tools/retirement/before-you-claim/
- recorded excerpt: “you are allowed to claim your benefits as early as age 62. You can choose to wait, and claim as late as age 70.”
- Re-fetched. The excerpt is a contiguous span running across a sentence boundary ("...as early as age 62. You can choose to wait, and claim as late as age 70."). Contiguous and verbatim, so it is a legitimate excerpt, but noted: it is two sentences, not one.

### 8. `src-mmwr-home-care-family` — **CONFIRMED**
- Morbidity and Mortality Weekly Report, Centers for Disease Control and Prevention
- https://www.cdc.gov/mmwr/volumes/72/wr/mm7223a8.htm
- recorded excerpt: “to 13.8% among those aged 65–74 years, 19.4% among those aged 75–84 years, and more than doubled to 39.8% among those aged ≥85 years.”
- Re-fetched. Age-banded care percentages present verbatim, including the 65-74 / 75-84 / 85+ gradient.

### 9. `src-nces-bb-age-completed-degree-requirements` — **CONFIRMED**
- National Center for Education Statistics, U.S. Department of Education
- https://nces.ed.gov/pubs2019/2019241.pdf
- recorded excerpt: “23 or younger 63.4 65.2 24–29 21.0 20.3 30 or older 15.5 14.5”
- PDF read with pypdf. The excerpt is a TABLE ROW and matches character for character: "23 or younger 63.4 65.2 24-29 21.0 20.3 30 or older 15.5 14.5", under the heading "Age completed requirements for 2015-16 bachelor’s degree".

### 10. `src-nchs-menarche-median` — **CONFIRMED**
- National Center for Health Statistics, Centers for Disease Control and Prevention
- https://www.cdc.gov/nchs/data/nhsr/nhsr146-508.pdf
- recorded excerpt: “The median age at menarche decreased from 12.1 in 1995 to 11.9 in 2013–2017.”
- PDF read with pypdf. Verbatim: "The median age at menarche decreased from 12.1 in 1995 to 11.9 in 2013-2017."

### 11. `src-nichd-puberty-onset` — **CONFIRMED**
- Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD), National Institutes of Health
- https://www.nichd.nih.gov/health/topics/puberty/conditioninfo
- recorded excerpt: “The physical changes that mark puberty typically begin in girls between ages 8 and 13 and in boys between ages 9 and 14.”
- Re-fetched. "The physical changes that mark puberty typically begin in girls between ages 8 and 13..." and "...and in boys between ages 9 and 14."

### 12. `src-p1-state-education-ecs-2025-texas` — **CONFIRMED**
- Education Commission of the States
- https://reports.ecs.org/comparisons/free-and-compulsory-school-age-requirements-2025
- recorded excerpt: “Texas 5 - 21 Tex. Educ. Code Ann. § 25.001 6 - 19 Tex. Educ. Code Ann. § 25.085”
- Re-fetched. Texas row reads "6 - 19" with citation "Tex. Educ. Code Ann. § 25.085".

### 13. `src-p1-state-education-wa-rcw-28a-225-010` — **CONFIRMED**
- Washington State Legislature
- https://app.leg.wa.gov/RCW/default.aspx?cite=28A.225.010
- recorded excerpt: “All parents in this state of any child eight years of age and under eighteen years of age shall cause such child to attend”
- Re-fetched. Statute text: "All parents in this state of any child eight years of age and under eighteen years of age shall cause such child to attend the public school".

### 14. `src-p1fc-fda-tobacco-21` — **CONFIRMED**
- U.S. Food and Drug Administration
- https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/tobacco-21
- recorded excerpt: “raising the federal minimum age for sale of tobacco products from 18 to 21 years”
- Re-fetched. "...it has been illegal for a retailer to sell any tobacco product, including e-cigarettes, to anyone under 21."

### 15. `src-p1fc-usagov-presidential-requirements` — **CONFIRMED**
- USAGov, U.S. General Services Administration
- https://www.usa.gov/requirements-for-presidential-candidates
- recorded excerpt: “Be at least 35 years old”
- Re-fetched. "Be at least 35 years old".

### 16. `src-p1fma-dol-agedisc` — **CONFIRMED**
- U.S. Department of Labor
- https://www.dol.gov/general/topic/discrimination/agedisc
- recorded excerpt: “The Age Discrimination in Employment Act of 1967 (ADEA) protects certain applicants and employees 40 years of age and older from discrimination”
- Re-fetched. "...protects certain applicants and employees 40 years of age and older from discrimination..."

### 17. `src-p1fma-irs-tc558-early-plans` — **CONFIRMED**
- Internal Revenue Service
- https://www.irs.gov/taxtopics/tc558
- recorded excerpt: “Generally, early distributions are those you receive from a qualified retirement plan or deferred annuity contract before reaching age 59½.”
- Re-fetched. "Generally, early distributions are those you receive from a qualified retirement plan or deferred annuity contract before reaching age 59½."

### 18. `src-p1ie-nces-kindergarten-entry-age` — **CONFIRMED**
- National Center for Education Statistics, U.S. Department of Education
- https://files.eric.ed.gov/fulltext/ED491697.pdf
- recorded excerpt: “Most children enter kindergarten when they are 5 years of age and move into first grade when they are 6.”
- PDF read with pypdf. Verbatim: "Most children enter kindergarten when they are 5 years of age and move into first grade when they are 6."

### 19. `src-p1swf-dol-age-requirements` — **CONFIRMED**
- U.S. Department of Labor
- https://www.dol.gov/general/topic/youthlabor/agerequirements
- recorded excerpt: “the FLSA sets 14 years old as the minimum age for employment”
- Re-fetched. "the FLSA sets 14 years old as the minimum age for employment" and the separate sixteen-hour-limit rule confirmed as a DIFFERENT rule, which is how the record encodes it.

### 20. `src-pew-aging-planning-seventies` — **CONFIRMED**
- Pew Research Center (reporting its own survey of United States adults, the primary survey)
- https://www.pewresearch.org/wp-content/uploads/sites/20/2025/11/ST_2025.11.06_aging_report.pdf
- recorded excerpt: “Roughly two-thirds of adults in their 70s (66%) say they have created a will and 64% have a living will or advance directive.”
- PDF read with pypdf. Verbatim: "Roughly two-thirds of adults in their 70s (66%) say they have created a will and 64% have a living will or advance directive."
