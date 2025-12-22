'use client'

import { useAppSelector } from "@/lib/hooks"
import { PDFViewer, Font } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDate, formatRichText } from "@/lib/utils"

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
        },
        {
            src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf',
            fontWeight: 'bold',
        },
    ],
});

export default function Preview() {
    const personal = useAppSelector(state => state.personal)
    const experiences = useAppSelector(state => state.experiences.list)
    const educations = useAppSelector(state => state.educations.list)
    const skills = useAppSelector(state => state.skills)
    const footer = useAppSelector(state => state.footer)

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 40,
            fontSize: 11,
            fontFamily: 'Roboto',
        },
        headerSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        section: {
            marginBottom: 10
        },
        sectionHeader: {
            marginBottom: 4,
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '1 solid gray',
            paddingBottom: 4,
        },
        sectionItem: {
            paddingTop: 6,
            paddingBottom: 6,
            borderBottom: '1 solid lightgray',
        },
        sectionItemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        footer: {
            marginTop: 12,
        },
        footerText: {
            fontSize: 9,
            color: 'gray',
        },
    });

    return(
        <PDFViewer className='w-full h-full' showToolbar={false}>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.headerSection}>
                        <View>
                            <Text>CV</Text>
                            <Text style={styles.title}>{personal.firstName} {personal.lastName}</Text>
                            {personal.email && <Text style={{ marginTop: 2 }}>{personal.email}</Text>}
                            {personal.phone && <Text style={{ marginTop: 2 }}>{personal.phone}</Text>}
                        </View>
                        <View>
                        </View>
                    </View>

                    {experiences.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Experience</Text>
                            {experiences.map((experience) => (
                                <View key={experience.id} style={styles.sectionItem}>
                                    <View style={styles.sectionItemHeader}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{experience.title} </Text>
                                            <Text>- {experience.company}</Text>
                                        </View>
                                        <Text>{formatDate(experience.startDate, 'short')} - {experience.isOngoing ? 'Present' : formatDate(experience.endDate, 'short')}</Text>
                                    </View>
                                    <Text>{experience.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {educations.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Education</Text>
                            {educations.map((education) => (
                                <View key={education.id} style={styles.sectionItem}>
                                    <View style={styles.sectionItemHeader}>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold' }}>{education.degree} </Text>
                                                <Text>- {education.fieldOfStudy}</Text>
                                            </View>
                                            <Text style={{ marginTop: 2 }}>{education.institution}</Text>
                                        </View>
                                        <Text>{formatDate(education.startDate, 'short')} - {education.isOngoing ? 'Present' : formatDate(education.endDate, 'short')}</Text>
                                    </View>
                                    <Text>{education.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {skills.skillsText && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Skills</Text>
                            </View>
                            {formatRichText(skills.skillsText).map((segment, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        marginBottom: 1,
                                        fontWeight: segment.bold ? 'bold' : 'normal',
                                        fontStyle: segment.italic ? 'italic' : 'normal',
                                    }}
                                >
                                    {segment.text}
                                </Text>
                            ))}
                        </View>
                    )}

                    {footer.footerText && (
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>{footer.footerText}</Text>
                        </View>
                    )}
                </Page>
            </Document>
        </PDFViewer>
    )
}