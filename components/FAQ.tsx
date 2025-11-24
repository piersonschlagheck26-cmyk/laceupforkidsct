'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'What percentage of donations actually goes to Ronald McDonald House of Connecticut and Massachusetts?',
    answer: '100% of net proceeds go directly to RMH CTMA. All operational costs are covered separately.'
  },
  {
    question: 'How do you ensure the shoes I donate actually get to families in need?',
    answer: 'We partner with reputable organizations that purchase our collected shoes. The funds generated from these partnerships are then donated to RMH CTMA, which directly supports families staying at their facilities.'
  },
  {
    question: 'Can I get a tax deduction for donating shoes or money?',
    answer: 'Lace Up For Kids is in the process of accepting tax-deductible donations, we\'d love your donation in the meantime!'
  },
  {
    question: 'What condition do the shoes need to be in for donation?',
    answer: 'We accept gently used shoes that are still in wearable condition. Shoes should be clean and free of significant damage.'
  },
  {
    question: 'What exactly are the hours of the drop-off locations?',
    answer: 'The box at Guilford Racquet & Swim Club is available the hours that their establishment is open, visit their site to learn more. Anyone is welcome to donate regardless of membership status. The First Congregational Church\'s box is in the basement, it\'s available during their available hours, most easily accesible on Sunday mornings.'
  },
  {
    question: 'What happens to the shoes after I drop them off?',
    answer: 'Collected shoes are sorted, organized, and then sold to partner organizations. The revenue generated from these sales is donated to RMH CTMA to support families.'
  },
  {
    question: 'How do you measure and report your impact?',
    answer: 'We track the number of pairs collected and the funds generated. We\'re transparent about our progress and share updates on our impact through our website and social media.'
  },
  {
    question: 'Who runs this organization, and what\'s their background?',
    answer: 'Lace Up for Kids is led by passionate high school students from Guilford, Connecticut, including Shane Tandler (Founder), Pierson Schlagheck (Chief Marketing Officer), and Conor Farrell (Chief Operating Officer), along with our dedicated crew members.'
  },
  {
    question: 'How can I make a monetary donation in addition to or instead of donating shoes?',
    answer: 'Monetary donations can be made through our Square checkout link by clicking on the \'Donate\' buttons. All monetary donations go directly to RMH CTMA.'
  },
  {
    question: 'What makes Lace Up for Kids different from other shoe donation programs?',
    answer: 'We\'re a teen-led organization that combines environmental sustainability (keeping shoes out of landfills) with direct community impact (supporting families at RMH CTMA). 100% of net proceeds go directly to the cause.'
  },
  {
    question: 'How often do you collect and process donations?',
    answer: 'This is dependent on volume, but donations are likely to be collected on a twice-weekly or weekly basis.'
  },
  {
    question: 'Do you accept all types of shoes, or only sneakers?',
    answer: 'We can accept most sneakers in serviceable condition, but we ask you to not donate dress shoes or athletic cleats.'
  },
  {
    question: 'Can businesses or organizations partner with you for larger donations?',
    answer: 'Yes, we welcome partnerships with businesses, schools, and organizations. Please contact us at laceupforkidsct@gmail.com to discuss partnership opportunities.'
  },
  {
    question: 'How can I stay updated on your progress and impact?',
    answer: 'Follow us on LinkedIn, Instagram, and check our website for regular updates on collections, events, and the impact we\'re making together.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" ref={ref} className="relative section-padding">
      {/* Background with smooth gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-50/20 via-white to-primary-50/30"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent-50/20 to-transparent"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 uppercase tracking-wider mb-4">
            Questions
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2">
            Have questions about how we work or how to get involved? Find answers to common questions below.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

