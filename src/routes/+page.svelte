<script>
    import { Section, News, HeroHeader, HeroBody, ContentWithImage,Cta } from 'flowbite-svelte-blocks';
    import { ArrowRightOutline, DatabaseSolid, CodeBranchSolid, CloudArrowUpSolid,ComputerSpeakerSolid, BrainSolid } from 'flowbite-svelte-icons';
    import { Button } from 'flowbite-svelte';
    import { Li, List, P, Heading} from 'flowbite-svelte';
    import {  Contact } from 'flowbite-svelte-blocks';
    import { Label, Input, Textarea } from 'flowbite-svelte';
    import {  FeatureDefault, FeatureItem } from 'flowbite-svelte-blocks';
    import { ChartPieSolid, LandmarkSolid, BriefcaseSolid, DollarOutline, RocketSolid, CogOutline } from 'flowbite-svelte-icons';
    import { Footer, FooterBrand, FooterLinkGroup, FooterLink, FooterCopyright, FooterIcon } from 'flowbite-svelte';
</script>

<Section name="heroDefault">
    <HeroHeader>
      <svelte:fragment slot="h1">Welcome to Share2Teach</svelte:fragment>
      <svelte:fragment slot="paragraph">
        A global hub for collaborative learning. Our platform empowers educators and students worldwide to access, contribute, and moderate high-quality educational resources—all in one place.
      </svelte:fragment>
    </HeroHeader>
    <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
      <a href="/get-started">
        <Button size="lg" color="red">
          Get Started <ArrowRightOutline size="md" class="ml-2 -mr-1" />
        </Button>
      </a>
    </div>
  </Section>
  
  <Section name="feature">
    <HeroHeader h2Class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      <svelte:fragment slot="h2">Why Share2Teach?</svelte:fragment>
      <svelte:fragment slot="paragraph">
        Discover a platform designed to make education collaborative, accessible, and innovative. Here’s what sets us apart:
      </svelte:fragment>
    </HeroHeader>
    <FeatureDefault>
      <FeatureItem>
        <svelte:fragment slot="icon"><DatabaseSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment>
        <svelte:fragment slot="h3">Accessible Knowledge</svelte:fragment>
        <svelte:fragment slot="paragraph">Open access to diverse educational resources tailored to all levels.</svelte:fragment>
      </FeatureItem>
      <FeatureItem>
        <svelte:fragment slot="icon"><CodeBranchSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment>
        <svelte:fragment slot="h3">Collaboration Made Easy</svelte:fragment>
        <svelte:fragment slot="paragraph">Upload, rate, and tag documents to foster a dynamic learning community.</svelte:fragment>
      </FeatureItem>
      <FeatureItem>
        <svelte:fragment slot="icon"><ChartPieSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment>
        <svelte:fragment slot="h3">User Engagement</svelte:fragment>
        <svelte:fragment slot="paragraph">Analytics to track and enhance user interaction.</svelte:fragment>
      </FeatureItem>
      <FeatureItem>
        <svelte:fragment slot="icon"><ComputerSpeakerSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment>
        <svelte:fragment slot="h3">Quality Assurance</svelte:fragment>
        <svelte:fragment slot="paragraph">Moderated content ensures resources meet high standards.</svelte:fragment>
      </FeatureItem>
    </FeatureDefault>
  </Section>

  <Section name="ctawithimg" id="Benefits">
    <Cta ctatype="image">
      <svelte:fragment slot="img">
        <img class="w-full dark:hidden" src="/S2T.png" alt="benefits" />
        <img class="w-full hidden dark:block" src="/S2T.png" alt="benefits" />
      </svelte:fragment>
      <svelte:fragment slot="h2">Benefits of Share2Teach</svelte:fragment>
      <List tag="ul" class="space-y-1 text-gray-500 dark:text-gray-400">
        <Li>**Empowers Educators and Learners**: Facilitates the sharing of knowledge and resources, fostering a collaborative learning environment.</Li>
        <Li>**Enhances Resource Accessibility**: Ensures high-quality educational materials are available to all, breaking down barriers to learning.</Li>
        <Li>**Encourages Lifelong Learning**: Supports continuous education by making resources freely accessible and easy to use.</Li>
        <Li>**Drives Innovation in Education**: Promotes the use of modern technologies and approaches to create impactful educational tools.</Li>
        <Li>**Fosters Community Growth**: Builds a global network of educators and students, united by a shared commitment to learning.</Li>
        <Li>**Supports Quality Assurance**: Moderation and feedback mechanisms ensure reliable and valuable content for users.</Li>
      </List>
    </Cta>
  </Section>
  
  
  <Section name="cta">
    <Cta>
      <svelte:fragment slot="h2">Join Us Today</svelte:fragment>
      <P size="xl">Whether you're an educator, student, or lifelong learner, Share2Teach is the perfect place to connect and grow.</P>
      <a href="/SignUp" class="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
        Create an Account
        <ArrowRightOutline size="md" class="ml-2 -mr-1" />
      </a>
    </Cta>
  </Section>
  