import React, { Component } from 'react'
import styles from './avatarCreator.module.scss'


export default class AvatarCreator extends Component {
    render() {
        return (
            <div>
                <iframe id="frame" className={styles['frame']} allow="camera *; microphone *"></iframe>
            </div>
        )
    }
}
