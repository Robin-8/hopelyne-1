const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('Starting seed process...');

  // 1. Clear existing data
  console.log('Clearing existing data...');
  await prisma.forumReply.deleteMany();
  await prisma.forumTopic.deleteMany();
  await prisma.usefulResource.deleteMany();
  await prisma.event.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Super Admin User
  console.log('Creating Super Admin User...');
  const passwordHash = await bcrypt.hash('HopeLyne2024!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hopelyne.com',
      passwordHash: passwordHash,
      name: 'Ayisha (Admin)',
      roles: 'SUPER_ADMIN',
    }
  });

  // 3. Create Team Members
  console.log('Creating Team Members...');
  const teamMembersData = [
    { name: 'Ayisha Rahman', role: 'Founder & Lead', bio: 'Passionate about creating safe spaces for students. Ayisha founded HopeLyne to ensure no student faces their challenges alone.', displayOrder: 1 },
    { name: 'Zara Khan', role: 'Co-Lead & Strategy', bio: 'Zara brings her experience in peer counseling and community organizing to help shape HopeLyne\'s direction and impact.', displayOrder: 2 },
    { name: 'Imran Malik', role: 'Content & Blog Lead', bio: 'A creative writer who believes in the power of stories to heal and inspire. Imran oversees all blog content and editorial direction.', displayOrder: 3 },
    { name: 'Priya Sharma', role: 'Events Coordinator', bio: 'Priya loves bringing people together. She plans and executes HopeLyne\'s events, workshops, and awareness campaigns.', displayOrder: 4 },
    { name: 'Omar Hassan', role: 'Community & Outreach', bio: 'Omar manages HopeLyne\'s social media presence and community engagement, ensuring every student\'s voice is heard.', displayOrder: 5 }
  ];
  for (const tm of teamMembersData) {
    await prisma.teamMember.create({ data: tm });
  }

  // 4. Create Blog Posts
  console.log('Creating Blog Posts...');
  const blogPostsData = [
    {
      title: 'You Are Not Alone: Understanding Peer Pressure',
      content: 'Peer pressure is a common challenge for students, manifesting as the influence from members of one\'s peer group. It can feel overwhelming and isolating when friends or classmates push you towards actions you\'re uncomfortable with.\n\nIt affects students emotionally, leading to anxiety, stress, and a compromised sense of self-worth. Students might find themselves making decisions that contradict their personal values just to fit in.\n\nSigns to recognize include feeling constantly stressed around certain friends, doing things you later regret, and feeling a loss of your own identity. It\'s important to be aware of these subtle shifts in behavior and mood.\n\nCoping involves setting firm boundaries and finding supportive friends who respect your choices. Remember, true friends will accept you for who you are, without conditions.\n\nThere is always hope. You have the power to define your own path and build a circle that uplifts rather than tears you down.',
      excerpt: 'Peer pressure is something almost every student faces. Learn to recognize the signs and discover strategies to stay true to yourself.',
      tags: 'peer-pressure,awareness,coping',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-01'),
      authorId: admin.id
    },
    {
      title: 'Dear Parents, We Need to Talk',
      content: 'Navigating parental expectations can be one of the most stressful parts of being a student. Often, the desire to make parents proud can overshadow a student\'s own aspirations and wellbeing.\n\nThe pressure students face from family to excel academically or choose a specific career path is immense. It can lead to burnout, depression, and a strained parent-child relationship.\n\nBetter communication starts with honesty and vulnerability. It\'s crucial to express how this pressure affects you and to share your own goals and dreams in a calm, structured conversation.\n\nFinding balance means acknowledging their good intentions while steadfastly asserting your own needs. It\'s a delicate negotiation that requires patience from both sides.\n\nYou are not alone in this struggle, and bridging the gap is possible with continuous, open dialogue and mutual understanding.',
      excerpt: 'The weight of parental expectations can feel crushing. Here\'s how to bridge the gap between what they want and what you need.',
      tags: 'parental-pressure,family,communication',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-10'),
      authorId: admin.id
    },
    {
      title: '5 Simple Self-Care Habits Every Student Should Practice',
      content: 'First, mindful breathing. Just five minutes of focused, deep breathing can reset your nervous system and significantly reduce anxiety before an exam or presentation.\n\nSecond, journaling. Writing down your thoughts helps untangle complex emotions and provides a safe outlet for stress and frustration.\n\nThird, physical movement. Whether it\'s a quick walk, yoga, or playing a sport, moving your body releases endorphins that naturally boost your mood.\n\nFourth, a digital detox. Taking regular breaks from screens and social media can vastly improve your sleep quality and mental clarity.\n\nFinally, connecting with friends. Genuine, face-to-face interactions foster a sense of belonging and remind you that you have a support system cheering you on.',
      excerpt: 'Self-care isn\'t selfish — it\'s survival. Discover five simple habits that can transform your daily student life.',
      tags: 'self-care,wellness,habits',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-20'),
      authorId: admin.id
    },
    {
      title: 'Breaking the Stigma: Why Mental Health Matters in School',
      content: 'Mental health stigma among students prevents many from seeking the help they desperately need. It creates an environment of silence and shame around struggles that are incredibly common.\n\nIt\'s important to talk about mental health to normalize these experiences. Open conversations can dismantle the fear of judgment and encourage peer support.\n\nResources are available, from school counselors to helplines and community support groups like HopeLyne. Knowing where to turn is the first step towards healing.\n\nSchools can do better by integrating mental health education into their curriculum, providing accessible counseling, and fostering a culture of empathy.\n\nBy speaking up, we pave the way for a more compassionate educational environment where every student can thrive.',
      excerpt: 'Mental health is just as important as physical health. It\'s time we treated it that way in our schools.',
      tags: 'mental-health,stigma,awareness',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-01'),
      authorId: admin.id
    },
    {
      title: 'How to Build a Support System That Actually Works',
      content: 'Identifying trusted people is the foundation of a good support system. Look for individuals who listen without judgment, respect your boundaries, and have your best interests at heart.\n\nBuilding genuine connections takes time and effort. It requires mutual vulnerability and a willingness to show up for others just as much as you want them to show up for you.\n\nKnowing when to ask for help is a sign of strength, not weakness. Don\'t wait until you\'re overwhelmed; reach out early and communicate what you need clearly.\n\nBeing a good support for others means practicing active listening and offering empathy rather than immediate solutions. It\'s about walking alongside them in their journey.\n\nA strong support system is a reciprocal network of care that empowers everyone involved to face life\'s challenges with resilience.',
      excerpt: 'Having the right people around you can make all the difference. Learn how to build a support system that truly supports.',
      tags: 'support,community,friendship',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-15'),
      authorId: admin.id
    }
  ];
  for (const post of blogPostsData) {
    post.slug = slugify(post.title);
    await prisma.blogPost.create({ data: post });
  }

  // 5. Create Events
  console.log('Creating Events...');
  const eventsData = [
    {
      title: 'HopeLyne Awareness Walk 2026',
      description: 'Join us for our inaugural awareness walk! Walk together to raise awareness about student mental health and break the stigma. Open to all students, teachers, and families. The walk will be followed by a community picnic and sharing circle.',
      date: new Date('2026-08-15T09:00:00'),
      time: '9:00 AM - 1:00 PM',
      venue: 'Central Community Park',
      type: 'UPCOMING'
    },
    {
      title: 'Mental Health Awareness Workshop',
      description: 'Our first workshop brought together over 30 students for an interactive session on recognizing stress, coping mechanisms, and building resilience. The workshop featured guest speakers, group activities, and resource sharing.',
      date: new Date('2026-06-10T14:00:00'),
      time: '2:00 PM - 5:00 PM',
      venue: 'School Auditorium',
      type: 'PAST',
      recap: 'An incredible turnout of 35 students participated in our first-ever workshop. Key highlights included a guided meditation session, peer sharing circles, and a resource fair. The feedback was overwhelmingly positive, with 95% of participants saying they learned something valuable.'
    }
  ];
  for (const event of eventsData) {
    await prisma.event.create({ data: event });
  }

  // 6. Create Useful Resources
  console.log('Creating Useful Resources...');
  const resourcesData = [
    { title: 'The 7 Habits of Highly Effective Teens', description: 'A guide for teens on building character and making smart choices. Sean Covey breaks down timeless principles in a fun, relatable way.', url: 'https://www.amazon.com/Habits-Highly-Effective-Teens/dp/1476764840', type: 'BOOK' },
    { title: 'Mindset: The New Psychology of Success', description: 'Carol Dweck reveals how a simple shift in mindset can transform your approach to challenges, learning, and personal growth.', url: 'https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322', type: 'BOOK' },
    { title: 'The Anxiety and Phobia Workbook', description: 'A comprehensive resource by Edmund J. Bourne with practical techniques and exercises for managing anxiety and stress.', url: 'https://www.amazon.com/Anxiety-Phobia-Workbook-Edmund-Bourne/dp/1626252157', type: 'BOOK' },
    { title: 'How to Deal with Peer Pressure', description: 'KidsHealth provides age-appropriate advice on understanding and standing up to peer pressure.', url: 'https://kidshealth.org/en/teens/peer-pressure.html', type: 'ARTICLE' },
    { title: 'Managing Academic Stress', description: 'The Child Mind Institute offers expert guidance on helping students manage the pressures of academic life.', url: 'https://childmind.org/article/tips-for-dealing-with-academic-stress/', type: 'ARTICLE' },
    { title: 'Adolescent Mental Health', description: 'World Health Organization fact sheet on adolescent mental health, key statistics, and global initiatives.', url: 'https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health', type: 'ARTICLE' },
    { title: 'How to Deal with Peer Pressure | TEDx', description: 'An inspiring TEDx talk about navigating peer pressure and staying authentic in social situations.', url: 'https://www.youtube.com/watch?v=gKGMOXe7HEQ', type: 'YOUTUBE' },
    { title: 'The Power of Vulnerability | Brené Brown', description: 'Brené Brown\'s groundbreaking TED talk on the importance of vulnerability, connection, and courage.', url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o', type: 'YOUTUBE' },
    { title: 'Self-Care for Students | Psych2Go', description: 'Practical self-care tips specifically designed for students dealing with stress and pressure.', url: 'https://www.youtube.com/watch?v=w0iVTQS8ftg', type: 'YOUTUBE' }
  ];
  for (const resource of resourcesData) {
    await prisma.usefulResource.create({ data: resource });
  }

  // 7. Create Forum Topics and Replies
  console.log('Creating Forum Topics and Replies...');
  const topicsData = [
    {
      category: 'Peer Pressure',
      title: 'How do you handle friends who try to influence your decisions?',
      content: 'I\'ve been struggling with friends who constantly push me to do things I\'m not comfortable with. Has anyone dealt with this? What strategies worked for you?',
      status: 'APPROVED',
      authorId: admin.id
    },
    {
      category: 'Self-Care & Wellness',
      title: 'What\'s your go-to self-care routine?',
      content: 'Looking for inspiration! What does your self-care routine look like? I want to start building better habits but don\'t know where to begin.',
      status: 'APPROVED',
      authorId: admin.id
    },
    {
      category: 'Parental Pressure',
      title: 'Dealing with high expectations from parents about grades',
      content: 'My parents expect straight A\'s and anything less feels like a failure to them. How do you deal with the constant pressure to perform academically?',
      status: 'APPROVED',
      authorId: admin.id
    }
  ];

  for (const topicData of topicsData) {
    const topic = await prisma.forumTopic.create({ data: topicData });
    // Add sample replies
    await prisma.forumReply.create({
      data: {
        content: 'I totally understand what you mean. Sometimes taking a step back and setting a clear boundary is necessary, even if it feels tough initially.',
        topicId: topic.id,
        authorId: admin.id
      }
    });
    await prisma.forumReply.create({
      data: {
        content: 'Thanks for sharing. What helped me was having a heart-to-heart with them and explaining how their actions affect me.',
        topicId: topic.id,
        authorId: admin.id
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
